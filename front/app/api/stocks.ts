// src/api/stocks.ts
import { api } from "./client";
import type { Item } from "./items";
import type { Warehouse } from "./warehouses";

export type StockMoveListResponse = {
  warehouse: Warehouse;        // Uuid en string
  item: Item;             // Uuid en string
  previous_quantity: string;   // si tu back serializa Decimal como string; si no, usa number
  new_quantity: string;        // idem
  total_atomic?: number | null;
  currency_code?: string | null;
};

export type StockMoveResponse = {
  warehouse_id: string;        // Uuid en string
  item_id: string;             // Uuid en string
  previous_quantity: string;   // si tu back serializa Decimal como string; si no, usa number
  new_quantity: string;        // idem
  total_atomic?: number | null;
  currency_code?: string | null;
};

export type StockMoveRequest = {
  warehouse_id: string;        // Uuid (string)
  item_id: string;             // Uuid (string)
  delta: string;               // Decimal → envía como string para precisión
  reason: string;
  allow_negative?: boolean;
  unit_price?: string;         // decimal string
  currency_code?: string;
};

export async function moveStock(payload: StockMoveRequest) {
  const res = await api.post("/stocks/move", payload);
  return res.data as StockMoveResponse;
}

export async function health() {
  const res = await api.get("/health");
  return res.data;
}

export async function listMovements() {
  const res = await api.get<StockMoveListResponse[]>("/stocks/movements");
  return res.data;
}
