use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Serialize, Deserialize, ToSchema, sqlx::FromRow, Debug, Clone)]
pub struct Item {
    pub id: uuid::Uuid,
    pub sku: String,
    pub name: String,
    pub description: String,
    pub price_atomic: i64,
    pub currency_code: String,
}
