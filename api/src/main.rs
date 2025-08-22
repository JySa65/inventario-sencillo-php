use std::{net::SocketAddr, str::FromStr};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use axum::Router;
use axum::http::{HeaderValue, Method};
use tower_http::cors::{Any, CorsLayer};

use inventario_api::{app, config::Config, openapi::ApiDoc};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let cfg: Config = Config::from_env()?;
    let state: app::AppState = app::build_state(&cfg).await?;

    // CORS (igual que ya tienes)
    let cors = if cfg.cors_origins.is_empty() {
        CorsLayer::permissive()
    } else {
        let mut allow_origins: Vec<HeaderValue> = vec![];
        for o in cfg.cors_origins {
            if let Ok(hv) = HeaderValue::from_str(o.trim()) {
                allow_origins.push(hv);
            }
        }
        CorsLayer::new()
            .allow_methods([
                Method::GET,
                Method::POST,
                Method::PUT,
                Method::DELETE,
                Method::PATCH,
                Method::OPTIONS,
            ])
            .allow_headers(Any)
            .allow_origin(allow_origins)
    };

    // Router + Swagger (el router queda tipado, pero sin estado adjunto)
    let api = app::build_router(cors);
    let app = Router::new()
        .merge(api)
        .merge(SwaggerUi::new("/docs").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .with_state(std::sync::Arc::new(state)); // <-- AQUÍ se inyecta el estado en Axum 0.8

    let addr: SocketAddr = SocketAddr::from_str(&format!("0.0.0.0:{}", cfg.api_port))?;
    println!(
        "API => http://{addr} | Docs => http://localhost:{}/docs",
        cfg.api_port
    );

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
