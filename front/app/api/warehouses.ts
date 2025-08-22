// src/api/warehouses.ts
import { api } from "./client";

export type Warehouse = { id: string; name: string; code: string };

export type CreateWarehouse = {
  name: string;
  code: string;
};

export async function listWarehouses(params?: {
  q?: string;
  limit?: number;
  offset?: number;
}) {
  const res = await api.get<Warehouse[]>("/warehouses", { params });
  return res.data;
}

export async function createWarehouse(payload: CreateWarehouse) {
  const res = await api.post<Warehouse>("/warehouses", payload);
  return res.data;
}
