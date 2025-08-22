#[derive(utoipa::OpenApi)]
#[openapi(
  paths(
    crate::routes::health::health,
    crate::routes::items::handlers::create_item,
    crate::routes::items::handlers::list_items,
    crate::routes::stocks::handlers::move_stock,
    crate::routes::stocks::handlers::list_movements,
    crate::routes::warehouses::handlers::create_warehouse,
    crate::routes::warehouses::handlers::list_warehouses
  ),
  components(
    schemas(
      crate::routes::health::Health,
      crate::routes::items::CreateItem,
      crate::routes::items::Item,
      crate::routes::stocks::StockMoveRequest,
      crate::routes::stocks::StockMoveResponse,
      crate::routes::warehouses::dto::CreateWarehouse,
      crate::routes::warehouses::dto::ListParams,
      crate::routes::warehouses::Warehouse
    )
  ),
  tags(
    (name = "health", description = "Health check endpoints"),
    (name = "items", description = "Endpoints for managing inventory items"),
    (name = "stocks", description = "Endpoints for managing stock movements"),
    (name = "warehouses", description = "Endpoints for managing warehouses")
  ),
  info(
    title="Inventario API",
    version="0.1.0",
    description="API for managing inventory items and stock movements."
  ),
)]
pub struct ApiDoc;
