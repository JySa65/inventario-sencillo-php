use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use validator::Validate;

#[derive(Serialize, Deserialize, ToSchema, Validate)]
#[serde(deny_unknown_fields)]
pub struct CreateWarehouse {
    #[validate(required(message = "code es requerido"))]
    pub code: Option<String>,

    #[validate(required(message = "name es requerido"))]
    pub name: Option<String>,
}

#[derive(Deserialize, ToSchema)]
pub struct ListParams {
    pub limit: Option<i64>,  // default 50
    pub offset: Option<i64>, // default 0
    pub q: Option<String>,   // búsqueda por nombre (opcional)
}
