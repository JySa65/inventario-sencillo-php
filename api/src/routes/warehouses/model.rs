use uuid::Uuid;

use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Serialize, Deserialize, ToSchema, sqlx::FromRow, Debug, Clone)]

pub struct Warehouse {
    pub id: Uuid,
    pub name: String,
    pub code: String,
    // pub created_at: chrono::DateTime<chrono::Utc>,
}
