use axum::http::StatusCode;
use axum::{Json, extract::State};
use std::sync::Arc;

use super::{CreateItem, Item};
use crate::error::AppError;
use crate::extractors::ValidatedJson;
use crate::{app::AppState, error::AppResult, money::decimal_to_atomic_str};

async fn get_currency_scale(pool: &sqlx::PgPool, code: &str) -> AppResult<u8> {
    let scale = sqlx::query_scalar!(
        r#"SELECT scale::INT2 as "scale!: i16" FROM currencies WHERE code = $1"#,
        code
    )
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| crate::error::AppError::BadRequest)?; // moneda no encontrada
    Ok(u8::try_from(scale).unwrap())
}

#[utoipa::path(
    post,
    path = "/items",
    tag="items",
    request_body = CreateItem,
    responses((status = 201, description = "Item creado", body = Item))
)]
pub async fn create_item(
    State(state): State<Arc<AppState>>,
    ValidatedJson(payload): ValidatedJson<CreateItem>,
) -> AppResult<(StatusCode, Json<Item>)> {
    let scale = get_currency_scale(&state.pool, &payload.currency_code).await?;
    let price_atomic = decimal_to_atomic_str(&payload.price, scale)?;

    let insert = sqlx::query_as!(
        Item,
        r#"
        INSERT INTO public.items (sku, name, description, price_atomic, currency_code)
        VALUES ($1, $2, COALESCE($3,''), $4, $5)
        RETURNING id, sku, name, description, price_atomic, currency_code
        "#,
        payload.sku,
        payload.name,
        payload.description,
        price_atomic,
        payload.currency_code
    )
    .fetch_one(&state.pool)
    .await;

    match insert {
        Ok(rec) => Ok((StatusCode::CREATED, Json(rec))),
        Err(e) => {
            if let Some(db_err) = e.as_database_error() {
                // 23505 = unique_violation
                if db_err.code().as_deref() == Some("23505") {

                    // // Identifica cuál constraint disparó
                    // let which = db_err.constraint().unwrap_or_default();
                    // let field = if which == "items_sku_ci_uk" {
                    //     "sku"
                    // } else if which == "items_name_ci_uk" {
                    //     "name"
                    // } else {
                    //     "unique"
                    // };
                    return Err(AppError::Conflict(
                        "Ya existe un item con ese sku o name".into(),
                    ));
                }
            }
            Err(AppError::from(e))
        }
    }
}

#[utoipa::path(
    get,
    path = "/items",
    tag="items",
    responses((status = 200, description = "Listado", body = [Item]))
)]
pub async fn list_items(State(state): State<Arc<AppState>>) -> AppResult<Json<Vec<Item>>> {
    let items = sqlx::query_as!(
        Item,
        r#"
        SELECT id, sku, name, description, price_atomic, currency_code
        FROM items
        ORDER BY created_at DESC
        "#
    )
    .fetch_all(&state.pool)
    .await?;

    Ok(Json(items))
}
