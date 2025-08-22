use std::env;

#[derive(Clone)]
pub struct Config {
    pub database_url: String,
    pub api_port: u16,
    pub jwt_secret: String,
    pub cors_origins: Vec<String>,
}

impl Config {
    pub fn from_env() -> anyhow::Result<Self> {
        dotenvy::dotenv().ok();
        let database_url = env::var("DATABASE_URL")?;
        let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|_| "dev".into());
        let api_port = env::var("API_PORT").ok().and_then(|s| s.parse().ok()).unwrap_or(8080);
        let cors_origins = env::var("CORS_ORIGINS")
            .unwrap_or_default()
            .split(',')
            .filter(|s| !s.trim().is_empty())
            .map(|s| s.trim().to_string())
            .collect();

        Ok(Self { database_url, api_port, jwt_secret, cors_origins })
    }
}
