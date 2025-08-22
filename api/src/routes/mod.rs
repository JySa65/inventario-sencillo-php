use crate::app::AppState;
use axum::{Router, routing::get};
use std::sync::Arc;

pub mod health;
pub mod items;
pub mod stocks;
pub mod warehouses;

pub fn router() -> Router<Arc<AppState>> {
    Router::<Arc<AppState>>::new()
        .route("/health", get(health::health))
        .nest("/items", items::router())
        .nest("/stocks", stocks::router())
        .nest("/warehouses", warehouses::router())
}
