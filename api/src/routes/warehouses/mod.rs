use crate::app::AppState;
use axum::{Router, routing::post};
use std::sync::Arc;

mod model;
pub mod dto;
pub mod handlers;

pub use dto::{CreateWarehouse, ListParams};
pub use handlers::{create_warehouse, list_warehouses};
pub use model::Warehouse;

pub fn router() -> Router<Arc<AppState>> {
    Router::<Arc<AppState>>::new().route("/", post(create_warehouse).get(list_warehouses))
}
