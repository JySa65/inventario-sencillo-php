use std::sync::Arc;

use super::{Stock, StockMoveRequest, StockMoveResponse};
use crate::{
    app::AppState,
    error::{AppError, AppResult},
    extractors::ValidatedJson,
    money::decimal_to_atomic_str,
    routes::stocks::dto::{ItemRow, WarehouseRow},
};

use axum::{extract::Json, extract::State};
use rust_decimal::Decimal;
use rust_decimal::prelude::ToPrimitive;
use sqlx::{Postgres, Transaction};

async fn get_item_currency_and_scale(
    tx: &mut Transaction<'_, Postgres>,
    item_id: uuid::Uuid,
) -> AppResult<(String, u8)> {
    // Usa la conexión interna del transaction
    let conn = tx.as_mut();

    let rec = sqlx::query!(
        r#"
        SELECT i.currency_code, c.scale::INT2 as "scale!: i16"
        FROM public.items i
        JOIN public.currencies c ON c.code = i.currency_code
        WHERE i.id = $1
        "#,
        item_id
    )
    .fetch_one(conn)
    .await?;

    Ok((rec.currency_code, u8::try_from(rec.scale).unwrap()))
}

#[utoipa::path(
    post,
    path = "/stocks/move",
    tag="stocks",
    request_body = StockMoveRequest,
    responses(
        (status = 200, description = "Movimiento aplicado", body = StockMoveResponse),
        (status = 400, description = "Validación fallida"),
        (status = 404, description = "No encontrado")
    )
)]
pub async fn move_stock(
    State(state): State<Arc<AppState>>,
    ValidatedJson(body): ValidatedJson<StockMoveRequest>,
) -> AppResult<Json<StockMoveResponse>> {
    // Desempaquetar campos requeridos (validator ya garantizó que no son None)
    let warehouse_id = body.warehouse_id.ok_or(AppError::BadRequest)?;
    let item_id = body.item_id.ok_or(AppError::BadRequest)?;
    let delta = body.delta.ok_or(AppError::BadRequest)?;

    // Validaciones de negocio adicionales
    if delta == Decimal::ZERO || body.reason.trim().is_empty() {
        return Err(AppError::BadRequest);
    }

    let mut tx = state.pool.begin().await?;

    // Verificar existencia de warehouse
    let wh_exists = sqlx::query_scalar!(
        r#"SELECT EXISTS(SELECT 1 FROM warehouses WHERE id = $1) AS "exists!""#,
        warehouse_id
    )
    .fetch_one(&mut *tx)
    .await?;
    if !wh_exists {
        return Err(AppError::NotFound);
    }

    // Verificar existencia de item
    let item_exists = sqlx::query_scalar!(
        r#"SELECT EXISTS(SELECT 1 FROM items WHERE id = $1) AS "exists!""#,
        item_id
    )
    .fetch_one(&mut *tx)
    .await?;
    if !item_exists {
        return Err(AppError::NotFound);
    }

    // Leer qty actual FOR UPDATE
    let current_qty: Option<Decimal> = sqlx::query_scalar!(
        r#"
        SELECT quantity
        FROM stocks
        WHERE warehouse_id = $1 AND item_id = $2
        FOR UPDATE
        "#,
        warehouse_id,
        item_id
    )
    .fetch_optional(&mut *tx)
    .await?;

    let prev_qty = current_qty.unwrap_or(Decimal::ZERO);
    let new_qty = delta + prev_qty;

    if !body.allow_negative && new_qty < Decimal::ZERO {
        return Err(AppError::BadRequest);
    }

    // UPSERT stock
    if current_qty.is_some() {
        sqlx::query!(
            r#"UPDATE stocks SET quantity = $1 WHERE warehouse_id = $2 AND item_id = $3"#,
            new_qty,
            warehouse_id,
            item_id
        )
        .execute(&mut *tx)
        .await?;
    } else {
        sqlx::query!(
            r#"INSERT INTO stocks (warehouse_id, item_id, quantity) VALUES ($1, $2, $3)"#,
            warehouse_id,
            item_id,
            new_qty
        )
        .execute(&mut *tx)
        .await?;
    }

    let (mut currency_code, mut total_atomic) = (None, None);

    if let Some(unit_price_str) = &body.unit_price {
        // Determinar moneda y escala
        let (item_curr, scale) = if let Some(cc) = &body.currency_code {
            let sc = sqlx::query_scalar!(
                r#"SELECT scale::INT2 as "scale!: i16" FROM currencies WHERE code = $1"#,
                cc
            )
            .fetch_optional(&mut *tx)
            .await?
            .ok_or(AppError::BadRequest)?; // moneda no válida
            (cc.clone(), u8::try_from(sc).unwrap())
        } else {
            // Usa el item_id ya desempaquetado
            get_item_currency_and_scale(&mut tx, item_id).await?
        };

        let unit_atomic = decimal_to_atomic_str(unit_price_str, scale)?;
        // total_atomic = round(delta * 10^3) * unit_atomic / 10^3 (si qty tiene 3 decimales)
        let milli = (delta * Decimal::from(1000u32)).round();
        let milli_i64 = milli
            .to_i64()
            .ok_or_else(|| anyhow::anyhow!("qty out of range"))?;
        let tot = (milli_i64 as i128) * (unit_atomic as i128) / 1000i128;
        let tot_i64 = i64::try_from(tot).map_err(|_| anyhow::anyhow!("total out of i64"))?;

        // Guardar movimiento con valuación
        sqlx::query!(
            r#"
            INSERT INTO stock_movements (
                    warehouse_id, item_id, delta, reason, unit_price_atomic,
                    currency_code, total_atomic, previous_quantity, new_quantity
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            "#,
            warehouse_id,
            item_id,
            delta,
            body.reason,
            unit_atomic,
            item_curr,
            tot_i64,
            prev_qty,
            new_qty
        )
        .execute(&mut *tx)
        .await?;

        currency_code = Some(item_curr);
        total_atomic = Some(tot_i64);
    } else {
        // Sin valuación: solo registra el movimiento
        sqlx::query!(
            r#"
            INSERT INTO stock_movements (warehouse_id, item_id, delta, reason, previous_quantity, new_quantity)
            VALUES ($1, $2, $3, $4, $5, $6)
            "#,
            warehouse_id,
            item_id,
            delta,
            body.reason,
            prev_qty,
            new_qty
        )
        .execute(&mut *tx)
        .await?;
    }

    let warehouse = sqlx::query_as!(
        WarehouseRow,
        r#"
        SELECT
          id,
          name,
          code
        FROM warehouses
        WHERE id = $1
        "#,
        warehouse_id
    )
    .fetch_one(&mut *tx)
    .await?;

    let item = sqlx::query_as!(
        ItemRow,
        r#"
        SELECT
          id,
          sku,
          name,
          description,
          price_atomic,
          currency_code
        FROM items
        WHERE id = $1
        "#,
        item_id
    )
    .fetch_one(&mut *tx)
    .await?;

    tx.commit().await?;

    let resp = StockMoveResponse {
        warehouse,
        item,
        previous_quantity: prev_qty,
        new_quantity: new_qty,
        total_atomic,
        currency_code,
    };

    Ok(Json(resp))
}

#[utoipa::path(
    get,
    path = "/stocks/movements",
    tag="stocks",
    responses(
        (status = 200, description = "Historial de movimientos", body = [StockMoveResponse])
    )
)]
pub async fn list_movements(
    State(state): State<Arc<AppState>>,
) -> AppResult<Json<Vec<StockMoveResponse>>> {
    let recs = Stock::get_movements(&state.pool).await;

    Ok(Json(recs))
}
