import { useMutation, useQuery } from "@tanstack/react-query";
import { listMovements, moveStock, type StockMoveRequest, type StockMoveResponse } from "../api/stocks";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Toast from "../ui/Toast";
import { useState } from "react";
import { listItems } from "~/api/items";
import { listWarehouses } from "~/api/warehouses";
import { Table, Th, Td } from "~/ui/Table";

export default function StocksPage() {
  const [toast, setToast] = useState<{ open: boolean; msg: string }>({
    open: false,
    msg: "",
  });
  const [globalError, setGlobalError] = useState("");

  const [form, setForm] = useState({
    warehouse_id: "", // Uuid
    item_id: "", // Uuid
    delta: "", // decimal string
    reason: "", // requerido
    unit_price: "", // opcional (decimal string)
    currency_code: "USD",
    allow_negative: false,
  });

  // Carga de items (uuid en id)
  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: ["items"],
    queryFn: listItems,
  });

  const { data: warehouses = [], isLoading: whLoading } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => listWarehouses({ limit: 100, offset: 0 }),
  });

  const {
    data: movements = [],
    isLoading: movLoading,
    refetch: refetchMovs,
  } = useQuery({
    queryKey: ["stock-movements"],
    queryFn: listMovements,
  });

  // Si aún no tienes listWarehouses, deja un <Input> para warehouse_id manual
  // const { data: warehouses = [], isLoading: whLoading } = useQuery({ queryKey: ["warehouses"], queryFn: listWarehouses });

  const mutate = useMutation({
    mutationFn: () =>
      moveStock({
        warehouse_id: form.warehouse_id,
        item_id: form.item_id,
        delta: form.delta.trim(), // Decimal como string
        reason: form.reason.trim(),
        unit_price: form.unit_price ? form.unit_price.trim() : undefined,
        currency_code: form.currency_code || undefined,
        allow_negative: form.allow_negative || undefined,
      } as StockMoveRequest),
    onSuccess: (data) => {
      setGlobalError("");
      setToast({
        open: true,
        msg: `Movimiento OK. Total: ${data.total_atomic ?? 0}`,
      });
      setForm({
        warehouse_id: "",
        item_id: "",
        delta: "",
        reason: "",
        unit_price: "",
        currency_code: "USD",
        allow_negative: false,
      });
      refetchMovs(); // Recargar movimientos
    },
    onError: (e: any) => {
      // Gracias al interceptor, e es { status, body }
      // Puedes reutilizar tu normalizeCreateItemError o crear uno para stocks.
      const msg =
        e?.status === 422
          ? "Revisa los campos requeridos (422)."
          : e?.status === 409
          ? e?.body?.error ?? "Conflicto (409)."
          : e?.body?.error ?? "Error al registrar movimiento.";
      setGlobalError(msg);
      setToast({ open: true, msg });
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h1 className="mb-4 text-lg font-semibold">Movimiento de Stock</h1>

        {globalError && (
          <div className="mb-3 rounded-[var(--radius-lg)] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {globalError}
          </div>
        )}

        <form
          className="grid grid-cols-1 gap-3 md:grid-cols-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (
              !form.warehouse_id ||
              !form.item_id ||
              !form.delta ||
              !form.reason.trim()
            ) {
              setGlobalError(
                "warehouse_id, item_id, delta y reason son requeridos."
              );
              return;
            }
            mutate.mutate();
          }}
        >
          {/* Warehouse */}
          <div className="md:col-span-1">
            <label className="mb-1 block text-xs font-medium">
              Warehouse ID
            </label>
            <Select
              value={form.warehouse_id}
              onChange={(e) =>
                setForm({ ...form, warehouse_id: e.target.value })
              }
            >
              {whLoading ? (
                <option>Cargando...</option>
              ) : (
                <>
                  <option value="">-- Seleccionar --</option>
                  {warehouses.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.code})
                    </option>
                  ))}
                </>
              )}
            </Select>
          </div>

          {/* Item */}
          <div className="md:col-span-1">
            <label className="mb-1 block text-xs font-medium">Item</label>
            <Select
              value={form.item_id}
              onChange={(e) => setForm({ ...form, item_id: e.target.value })}
            >
              {itemsLoading ? (
                <option>Cargando...</option>
              ) : (
                <>
                  <option value="">-- Seleccionar --</option>
                  {items.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.sku})
                    </option>
                  ))}
                </>
              )}
            </Select>
          </div>

          {/* Delta */}
          <div>
            <label className="mb-1 block text-xs font-medium">
              Delta (cantidad)
            </label>
            <Input
              placeholder="ej. 1.000 o -2.5"
              value={form.delta}
              onChange={(e) => setForm({ ...form, delta: e.target.value })}
              required
            />
          </div>

          {/* Reason */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium">Razón</label>
            <Input
              placeholder="p.ej. 'ajuste inventario' o 'compra'"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              required
            />
          </div>

          {/* Unit price (opcional) */}
          <div>
            <label className="mb-1 block text-xs font-medium">
              Precio unitario (opcional)
            </label>
            <Input
              value={form.unit_price}
              onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
              placeholder="12.34"
            />
          </div>

          {/* Currency */}
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

          {/* Allow negative */}
          {/* <div className="flex items-center gap-2">
            <input
              id="neg"
              type="checkbox"
              checked={form.allow_negative}
              onChange={(e) =>
                setForm({ ...form, allow_negative: e.target.checked })
              }
              className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-primary)]"
            />
            <label htmlFor="neg" className="text-sm">
              Permitir saldo negativo
            </label>
          </div> */}

          <div className="md:col-span-3">
            <Button type="submit" disabled={mutate.isPending}>
              {mutate.isPending ? "Registrando..." : "Registrar movimiento"}
            </Button>
          </div>
        </form>

        <Toast
          open={toast.open}
          msg={toast.msg}
          onClose={() => setToast({ open: false, msg: "" })}
        />
      </Card>

      <Card className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Movimientos recientes</h2>
          <button
            className="text-xs underline"
            onClick={() => refetchMovs()}
            disabled={movLoading}
          >
            Recargar
          </button>
        </div>

        {movLoading ? (
          <p>Cargando…</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Warehouse</Th>
                <Th>Item</Th>
                <Th>Previo</Th>
                <Th>Delta</Th>
                <Th>Nuevo</Th>
                <Th>Total (atomic)</Th>
                <Th>Moneda</Th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 ? (
                <tr>
                  <Td colSpan={7} className="text-neutral-500">
                    Sin movimientos.
                  </Td>
                </tr>
              ) : (
                movements.map((m, i) => (
                  <tr key={i}>
                    <Td className="font-mono text-xs">{m.warehouse.name} ({m.warehouse.code})</Td>
                    <Td className="font-mono text-xs">{m.item.name}</Td>
                    <Td>{m.previous_quantity}</Td>
                    {/* delta = new - prev (como string → número seguro si lo necesitas) */}
                    <Td>
                      {String(
                        Number(m.new_quantity) - Number(m.previous_quantity)
                      )}
                    </Td>
                    <Td>{m.new_quantity}</Td>
                    <Td>{m.total_atomic ?? "—"}</Td>
                    <Td>{m.currency_code ?? "—"}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
