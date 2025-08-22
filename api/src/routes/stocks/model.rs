use super::StockMoveResponse;

pub struct Stock {}

impl Stock {
    pub async fn get_movements(pool: &sqlx::PgPool) -> Vec<StockMoveResponse> {
        let recs = sqlx::query_as::<_, StockMoveResponse>(
            r#"
            SELECT
              w.id   AS warehouse_id,
              w.name AS warehouse_name,
              w.code AS warehouse_code,

              i.id            AS item_id,
              i.sku           AS item_sku,
              i.name          AS item_name,
              i.description   AS item_description,
              i.price_atomic  AS item_price_atomic,
              i.currency_code AS item_currency_code,

              sm.total_atomic,
              sm.currency_code,

              COALESCE(
                SUM(sm.delta) OVER (
                  PARTITION BY sm.warehouse_id, sm.item_id
                  ORDER BY sm.created_at
                  ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
                ), 0
              ) AS previous_quantity,
              SUM(sm.delta) OVER (
                PARTITION BY sm.warehouse_id, sm.item_id
                ORDER BY sm.created_at
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
              ) AS new_quantity

            FROM stock_movements sm
            JOIN warehouses w ON w.id = sm.warehouse_id
            JOIN items      i ON i.id = sm.item_id
            ORDER BY sm.created_at DESC
            "#,
        )
        .fetch_all(pool)
        .await
        // si hay error, devuelves vec vacío
        .unwrap_or_else(|_| vec![]);

        recs
    }
}
