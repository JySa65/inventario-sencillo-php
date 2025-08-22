use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use validator::Validate;

#[derive(Serialize, Deserialize, ToSchema, Validate)]
#[serde(deny_unknown_fields)]
pub struct CreateItem {
    #[validate(required(message = "sku es requerido"))]
    pub sku: Option<String>,

    #[validate(required(message = "name es requerido"))]
    pub name: Option<String>,

    #[serde(default)]
    pub description: Option<String>,

    #[validate(length(min = 1, message = "price no puede estar vacío"))]
    pub price: String,

    #[validate(length(equal = 3, message = "currency_code debe ser ISO (3 letras)"))]
    pub currency_code: String,
}
