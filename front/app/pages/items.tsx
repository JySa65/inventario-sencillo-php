import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createItem,
  listItems,
  type Item,
  type CreateItemPayload,
} from "../api/items";
import { formatAtomic } from "../lib/money";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { Table, Th, Td } from "../ui/Table";
import Toast from "../ui/Toast";
import { useMemo, useState } from "react";
import type { NormalizedError } from "~/api/error-normalizer";

const PRICE_RX = /^-?\d+(\.\d{1,6})?$/; // ej: 12, 12.3, 12.345678

export default function ItemsPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: listItems,
  });

  const [toast, setToast] = useState<{ open: boolean; msg: string }>({
    open: false,
    msg: "",
  });
  const [form, setForm] = useState<CreateItemPayload>({
    sku: "",
    name: "",
    description: "",
    price: "",
    currency_code: "USD",
  });

  const priceValid = useMemo(
    () => PRICE_RX.test(form.price || ""),
    [form.price]
  );

  const create = useMutation({
    mutationFn: () =>
      createItem({
        sku: form.sku.trim(),
        name: form.name.trim(),
        // description es opcional -> no lo envíes si está vacío
        ...(form.description?.trim()
          ? { description: form.description.trim() }
          : {}),
        price: form.price.trim(),
        currency_code: form.currency_code,
      }),
    onSuccess: () => {
      setToast({ open: true, msg: "Item creado ✅" });
      setForm({
        sku: "",
        name: "",
        description: "",
        price: "",
        currency_code: "USD",
      });
      qc.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (err: Partial<NormalizedError>) => {
      setToast({
        open: true,
        msg: `Error al crear el item ❌:
        ${err.global}`,
      });
    },
  });

  return (
    <div className="grid gap-6">
      <Card>
        <h1 className="mb-4 text-lg font-semibold">Crear Item</h1>
        <form
          className="grid grid-cols-1 gap-3 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!priceValid)
              return setToast({
                open: true,
                msg: "Precio inválido (usa decimal: 12.34)",
              });
            create.mutate();
          }}
        >
          <div>
            <label className="mb-1 block text-xs font-medium">SKU</label>
            <Input
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              placeholder="SKU-001"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium">Nombre</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium">
              Descripción (opcional)
            </label>
            <Input
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Descripción breve"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium">
              Precio (decimal)
            </label>
            <Input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="12.34"
              required
            />
            {!priceValid && form.price && (
              <p className="mt-1 text-xs text-red-600">
                Formato inválido. Ej: 12.34
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium">Moneda</label>
            <Select
              value={form.currency_code}
              onChange={(e) =>
                setForm({ ...form, currency_code: e.target.value })
              }
            >
              <option value="USD">USD</option>
              <option value="JPY">JPY</option>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={create.isPending || !priceValid}>
              {create.isPending ? "Creando..." : "Crear"}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">Items</h2>
        {isLoading ? (
          <p>Cargando...</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>SKU</Th>
                <Th>Nombre</Th>
                <Th>Descripción</Th>
                <Th>Precio</Th>
                <Th>Moneda</Th>
              </tr>
            </thead>
            <tbody>
              {data.map((it: Item) => (
                <tr key={it.id}>
                  <Td>{it.id}</Td>
                  <Td className="font-mono">{it.sku}</Td>
                  <Td>{it.name}</Td>
                  <Td className="text-neutral-600">{it.description ?? "—"}</Td>
                  <Td>
                    {formatAtomic(
                      it.price_atomic,
                      it.currency_code === "JPY" ? 0 : 2
                    )}
                  </Td>
                  <Td>{it.currency_code}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Toast
        open={toast.open}
        msg={toast.msg}
        onClose={() => setToast({ open: false, msg: "" })}
      />
    </div>
  );
}
