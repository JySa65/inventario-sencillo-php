import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("pages/home.tsx"),

  route("items", "pages/items.tsx"),
  route("stocks", "pages/stocks.tsx"),
  route("health", "pages/health.tsx"),
  route("warehouses", "pages/warehouses.tsx"),
] satisfies RouteConfig;
