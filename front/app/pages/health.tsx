import { useQuery } from "@tanstack/react-query";
import { health } from "../api/stocks";
import Card from "../ui/Card";

export default function HealthPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ["health"], queryFn: health });

  return (
    <Card>
      <h1 className="mb-3 text-lg font-semibold">Health</h1>
      {isLoading && <p>Cargando...</p>}
      {error && <p className="text-red-600">Error al cargar</p>}
      {data && <pre className="overflow-auto rounded bg-[var(--color-bg)] p-3 text-sm">{JSON.stringify(data, null, 2)}</pre>}
    </Card>
  );
}
