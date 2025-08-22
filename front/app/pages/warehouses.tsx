import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWarehouse,
  listWarehouses,
  type Warehouse,
} from "~/api/warehouses";
import Card from "~/ui/Card";
import Button from "~/ui/Button";
import Input from "~/ui/Input";
import { Table, Th, Td } from "~/ui/Table";
import Toast from "~/ui/Toast";
import { useMemo, useState } from "react";

export default function WarehousesPage() {
  const qc = useQueryClient();

  // ---- filtros y form ----
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [toast, setToast] = useState<{ open: boolean; msg: string }>({
    open: false,
    msg: "",
  });
  const [globalError, setGlobalError] = useState("");

  // ---- query: lista ----
  const {
    data = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["warehouses", { q }],
    queryFn: () => listWarehouses(q ? { q } : undefined),
  });

  // ---- mutation: crear ----
  const canCreate = useMemo(() => name.trim().length >= 1, [name]);

  const createMut = useMutation({
    mutationFn: () => createWarehouse({ name: name.trim(), code: code.trim() }),
    onSuccess: () => {
      setName("");
      setCode("");
      setGlobalError("");
      setToast({ open: true, msg: "Warehouse creado ✅" });
      qc.invalidateQueries({ queryKey: ["warehouses"] });
    },
    onError: (e: any) => {
      // Con nuestro interceptor: e = { status, body }
      const msg =
        e?.status === 409
          ? e?.body?.error ?? "Conflicto (409)."
          : e?.status === 422
          ? e?.body?.error ?? "Validación (422)."
          : e?.body?.error ?? "No se pudo crear el warehouse.";
      setGlobalError(msg);
      setToast({ open: true, msg });
    },
  });

  return (
    <div className="grid gap-6">
      {/* Crear */}
      <Card>
        <h1 className="mb-4 text-lg font-semibold">Crear Warehouse</h1>

        {globalError && (
          <div className="mb-3 rounded-[var(--radius-lg)] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {globalError}
          </div>
        )}

        <form
          className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canCreate)
              return setGlobalError("El nombre no puede estar vacío.");
            createMut.mutate();
          }}
        >
          <div>
            <label className="mb-1 block text-xs font-medium">Nombre</label>
            <Input
              placeholder="Ej. Almacén Central"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">Codigo</label>
            <Input
              placeholder="Ej. 123"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={createMut.isPending || !canCreate}>
              {createMut.isPending ? "Creando..." : "Crear"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Filtros */}
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium">Buscar</label>
            <Input
              placeholder="Filtrar por nombre"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="text-xs text-neutral-500">
            {isFetching ? "Actualizando…" : " "}
          </div>
        </div>
      </Card>

      {/* Lista */}
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Warehouses</h2>
        {isLoading ? (
          <p>Cargando…</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Nombre</Th>
                <Th>Codigo</Th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <Td className="text-neutral-500" colSpan={3}>
                    No hay resultados.
                  </Td>
                </tr>
              ) : (
                data.map((w: Warehouse) => (
                  <tr key={w.id}>
                    <Td className="font-mono text-xs">{w.id}</Td>
                    <Td>{w.name}</Td>
                    <Td>{w.code}</Td>
                  </tr>
                ))
              )}
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
