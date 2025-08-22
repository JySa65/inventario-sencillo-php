pub async fn connect(url: &str) -> anyhow::Result<sqlx::PgPool> {
    let pool = sqlx::PgPool::connect(url).await?;
    Ok(pool)
}
