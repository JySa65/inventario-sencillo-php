use crate::app::AppState;
use axum::{
    Router,
    routing::{get, post},
};
use std::sync::Arc;

mod dto;
pub mod handlers;
pub mod model;


pub use model::Stock;
pub use dto::{StockMoveRequest, StockMoveResponse};
pub use handlers::{list_movements, move_stock};

pub fn router() -> Router<Arc<AppState>> {
    Router::<Arc<AppState>>::new()
        .route("/move", post(move_stock))
        .route("/movements", get(list_movements))
}
