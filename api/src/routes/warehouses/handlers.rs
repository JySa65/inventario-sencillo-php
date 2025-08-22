use axum::{
    Json,
    extract::{Query, State},
    http::StatusCode,
};

use std::sync::Arc;

use super::{CreateWarehouse, ListParams, Warehouse};
use crate::{error::AppError, extractors::ValidatedJson};

use crate::{app::AppState, error::AppResult};

#[utoipa::path(
    get,
    path = "/warehouses",
    params(
        ("limit" = Option<i64>, Query, description = "máx. registros (default 50)"),
        ("offset" = Option<i64>, Query, description = "desplazamiento (default 0)"),
        ("q" = Option<String>, Query, description = "filtro por nombre")
    ),
    responses(
        (status = 200, description = "Listado de warehouses", body = [Warehouse])
    ),
    tag = "Warehouses",
    operation_id = "listWarehouses"
)]
pub async fn list_warehouses(
    State(state): State<Arc<AppState>>,
    Query(params): Query<ListParams>,
) -> Result<Json<Vec<Warehouse>>, AppError> {
    let limit = params.limit.unwrap_or(50).clamp(1, 200);
    let offset = params.offset.unwrap_or(0).max(0);

    let rows = if let Some(q) = params.q.as_deref() {
        sqlx::query_as!(
            Warehouse,
            r#"
            SELECT id, name, code
            FROM warehouses
            WHERE name ILIKE '%' || $1 || '%'
            ORDER BY name ASC
            LIMIT $2 OFFSET $3
            "#,
            q,
            limit,
            offset
        )
        .fetch_all(&state.pool)
        .await?
    } else {
        sqlx::query_as!(
            Warehouse,
            r#"
            SELECT id, name, code
            FROM warehouses
            ORDER BY name ASC
            LIMIT $1 OFFSET $2
            "#,
            limit,
            offset
        )
        .fetch_all(&state.pool)
        .await?
    };

    Ok(Json(rows))
}

#[utoipa::path(
    post,
    path = "/warehouses",
    request_body = CreateWarehouse,
    responses(
        (status = 201, description = "Creado", body = Warehouse)
    ),
    tag = "Warehouses",
    operation_id = "createWarehouse"
)]
pub async fn create_warehouse(
    State(state): State<Arc<AppState>>,
    ValidatedJson(body): ValidatedJson<CreateWarehouse>,
) -> AppResult<(StatusCode, Json<Warehouse>)> {
    let insert = sqlx::query_as!(
        Warehouse,
        r#"
        INSERT INTO warehouses (name, code)
        VALUES ($1, $2)
        RETURNING id, name, code
        "#,
        body.name,
        body.code
    )
    .fetch_one(&state.pool)
    .await;

    match insert {
        Ok(rec) => Ok((StatusCode::CREATED, Json(rec))),
        Err(e) => {
            if let Some(db_err) = e.as_database_error() {
                // 23505 = unique_violation
                if db_err.code().as_deref() == Some("23505") {
                    return Err(AppError::Conflict(
                        "Ya existe un almancen con este code o nombre".into(),
                    ));
                }
            }
            Err(AppError::from(e))
        }
    }
}
