import { api } from "./client";

export type Item = {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  price_atomic: number;
  currency_code: string;
};

export type CreateItemPayload = {
  sku: string;
  name: string;
  description?: string;
  price: string;
  currency_code: string;
};

export async function listItems(): Promise<Item[]> {
  const res = await api.get("/items");
  return res.data;
}

export async function createItem(payload: CreateItemPayload) {
  const res = await api.post("/items", payload);
  return res.data;
}
