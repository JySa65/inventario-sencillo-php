// src/app.rs
use axum::Router;
use tower_http::{trace::TraceLayer, cors::CorsLayer};
use crate::{db, config::Config, routes};
use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub pool: sqlx::PgPool,
    pub jwt_secret: String,
}

pub async fn build_state(cfg: &Config) -> anyhow::Result<AppState> {
    let pool = db::connect(&cfg.database_url).await?;
    Ok(AppState {
        pool,
        jwt_secret: cfg.jwt_secret.clone(),
    })
}

pub fn build_router(cors: CorsLayer) -> Router<Arc<AppState>> {
    Router::new()
        .merge(routes::router())
        .layer(TraceLayer::new_for_http())
        .layer(cors)
}
