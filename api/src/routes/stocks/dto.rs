use rust_decimal::Decimal;
use rust_decimal::serde::str as dec_str;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use validator::Validate;


#[derive(Serialize, Deserialize, ToSchema, Validate)]
#[serde(deny_unknown_fields)]
pub struct StockMoveRequest {
    #[validate(required(message = "warehouse_id es requerido"))]
    pub warehouse_id: Option<uuid::Uuid>,

    #[validate(required(message = "item_id es requerido"))]
    pub item_id: Option<uuid::Uuid>,

    pub delta: Option<Decimal>,

    // #[validate(length(min = 1, message = "reason no puede estar vacío"))]
    #[serde(default)]
    pub reason: String,

    #[serde(default)]
    pub allow_negative: bool,

    // unit_price decimal como string opcional; puedes validar formato:
    // #[validate(regex(path = *DECIMAL_RX, message = "unit_price debe ser decimal"))]
    #[serde(default)]
    pub unit_price: Option<String>,

    // currency ISO opcional; ej. longitud 3:
    // #[validate(length(equal = 3, message = "currency_code debe tener 3 letras"))]
    #[serde(default)]
    pub currency_code: Option<String>,
}

// #[derive(Serialize, Deserialize, ToSchema)]
// pub struct StockMoveResponse {
//     pub warehouse_id: uuid::Uuid,
//     pub item_id: uuid::Uuid,
//     pub previous_quantity: Decimal,
//     pub new_quantity: Decimal,
//     pub total_atomic: Option<i64>,
//     pub currency_code: Option<String>,
// }

#[derive(Serialize, Deserialize, sqlx::FromRow, ToSchema)]
pub struct WarehouseRow {
    #[sqlx(rename = "warehouse_id")]
    pub id: uuid::Uuid,
    #[sqlx(rename = "warehouse_name")]
    pub name: String,
    #[sqlx(rename = "warehouse_code")]
    pub code: String,
}

#[derive(Serialize, Deserialize, sqlx::FromRow, ToSchema)]
pub struct ItemRow {
    #[sqlx(rename = "item_id")]
    pub id: uuid::Uuid,
    #[sqlx(rename = "item_sku")]
    pub sku: String,
    #[sqlx(rename = "item_name")]
    pub name: String,
    #[sqlx(rename = "item_description")]
    pub description: String,
    #[sqlx(rename = "item_price_atomic")]
    pub price_atomic: i64,
    #[sqlx(rename = "item_currency_code")]
    pub currency_code: String,
}

#[derive(Serialize, Deserialize, ToSchema, sqlx::FromRow)]
pub struct StockMoveResponse {
    #[sqlx(flatten)]
    pub warehouse: WarehouseRow,
    #[sqlx(flatten)]
    pub item: ItemRow,
    pub total_atomic: Option<i64>,
    pub currency_code: Option<String>,
    #[serde(with = "dec_str")]
    pub previous_quantity: Decimal,
    #[serde(with = "dec_str")]
    pub new_quantity: Decimal,
}
