export type NormalizedError = {
  status?: number;
  global: string;
  fields: Record<string, string[]>;
};

export function normalizeCreateItemError(e: any): NormalizedError {
  // Si viene exactamente como lo define el back (status + body)
  const err = e;
  const body = err.response?.data ?? {};


  // 422 - validación por campo
  if (err?.status === 422) {
    const details = (err as any).body?.details ?? {};
    return {
      status: 422,
      global: "Hay errores de validación en el formulario.",
      fields: details,
    };
  }

  // 409 - conflicto (p. ej. SKU único)
  if (err?.status === 409) {
    const msg = body.error ?? "Conflicto";
    return { status: 409, global: msg, fields: {} };
  }

  // 415 - content-type inválido
  if (err?.status === 415) {
    return {
      status: 415,
      global:
        (err as any).body?.error ??
        "Content-Type inválido (esperado application/json).",
      fields: {},
    };
  }

  // 400 - JSON inválido (parser)
  if (err?.status === 400 && (err as any).body?.error === "invalid_json") {
    const msg = (err as any).body?.message ?? "JSON inválido.";
    return { status: 400, global: msg, fields: {} };
  }

  // 400 - otros bad request
  if (err?.status === 400) {
    const msg = (err as any).body?.error ?? "Bad request.";
    return { status: 400, global: msg, fields: {} };
  }

  // 404
  if (err?.status === 404) {
    const msg = (err as any).body?.error ?? "Recurso no encontrado.";
    return { status: 404, global: msg, fields: {} };
  }

  // 500
  if (err?.status === 500) {
    const msg = (err as any).body?.error ?? "Error interno.";
    return { status: 500, global: msg, fields: {} };
  }

  // Fallback genérico
  return { global: "Error inesperado.", fields: {} };
}
