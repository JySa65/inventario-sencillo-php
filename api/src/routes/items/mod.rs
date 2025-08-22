use axum::{Router, routing::post};
use std::sync::Arc;
use crate::app::AppState;

mod model;
mod dto;
pub mod handlers;


pub use handlers::{create_item, list_items};
pub use model::Item;
pub use dto::CreateItem;

pub fn router() -> Router<Arc<AppState>> {
    // Tipa explícitamente el Router al mismo estado que usan los handlers
    Router::<Arc<AppState>>::new()
        .route("/", post(create_item).get(list_items))
}
