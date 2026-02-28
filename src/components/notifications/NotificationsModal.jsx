import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { getReabastecimientos } from "../../services/Reabastecimientos/getReabastecimientos";
import { aprobarReabastecimiento } from "../../services/Reabastecimientos/aprobarReabastecimiento";
import { cancelarReabastecimiento } from "../../services/Reabastecimientos/cancelarReabastecimiento";

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export default function NotificationsModal({ open, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState(null);
  const [error, setError] = useState(null);

  const pendientes = useMemo(() => {
    const hasEstado = items.some((x) => x.estado);
    if (!hasEstado) return items;
    return items.filter((x) => String(x.estado).toLowerCase().includes("pend"));
  }, [items]);

  const cargar = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getReabastecimientos();
      setItems(data);
    } catch (e) {
      setError(e?.message || "No se pudieron cargar las notificaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onAprobar = async (id) => {
    if (!window.confirm("¿Aprobar este reabastecimiento?")) return;
    try {
      setActingId(id);
      setError(null);
      await aprobarReabastecimiento(id);
      await cargar();
    } catch (e) {
      setError(e?.message || "No se pudo aprobar");
    } finally {
      setActingId(null);
    }
  };

  const onCancelar = async (id) => {
    if (!window.confirm("¿Cancelar este reabastecimiento?")) return;
    try {
      setActingId(id);
      setError(null);
      await cancelarReabastecimiento(id);
      await cargar();
    } catch (e) {
      setError(e?.message || "No se pudo cancelar");
    } finally {
      setActingId(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-60">
      <DialogBackdrop className="fixed inset-0 bg-gray-900/60" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          <DialogPanel className="w-full max-w-2xl rounded-xl bg-white shadow-xl outline outline-gray-900/10">
            <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Notificaciones de reabastecimiento
                </h3>
                <p className="text-xs text-gray-500">
                  Solicitudes por bajo inventario
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cargar}
                  disabled={loading}
                  className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-200 disabled:opacity-50"
                >
                  {loading ? "Cargando…" : "Recargar"}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md bg-black px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Cerrar
                </button>
              </div>
            </div>

            {error && (
              <div className="mx-4 mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200 sm:mx-6">
                {error}
              </div>
            )}

            <div className="p-4 sm:p-6">
              {loading ? (
                <div className="text-sm text-gray-600">Cargando…</div>
              ) : pendientes.length === 0 ? (
                <div className="text-sm text-gray-600">
                  No hay notificaciones pendientes.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendientes.map((n) => (
                    <div
                      key={n.id}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {n.nombreProducto}{" "}
                            <span className="font-normal text-gray-500">
                              ({n.codigoProducto})
                            </span>
                          </div>

                          <div className="mt-1 text-xs text-gray-600">
                            ProductoId: {n.productoId} · Cantidad sugerida:{" "}
                            <span className="font-semibold">
                              {n.cantidadSugerida}
                            </span>
                          </div>

                          <div className="mt-1 text-xs text-gray-500">
                            Estado: {n.estado || "—"} · {fmtDate(n.timestamp)}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => onAprobar(n.id)}
                            disabled={actingId === n.id}
                            className="rounded-md bg-black px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                          >
                            {actingId === n.id ? "…" : "Aprobar"}
                          </button>

                          <button
                            type="button"
                            onClick={() => onCancelar(n.id)}
                            disabled={actingId === n.id}
                            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                          >
                            {actingId === n.id ? "…" : "Cancelar"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}