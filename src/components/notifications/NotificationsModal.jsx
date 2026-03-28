import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { getReabastecimientos } from "../../services/Reabastecimientos/getReabastecimientos";
import { aprobarReabastecimiento } from "../../services/Reabastecimientos/aprobarReabastecimiento";
import { cancelarReabastecimiento } from "../../services/Reabastecimientos/cancelarReabastecimiento";
import { getPedidosClientes } from "../../services/PedidosClientes/getPedidosClientes";
import { useNavigate } from "react-router-dom";

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

function normalizarEstado(estado) {
  return String(estado || "").trim().toLowerCase();
}

function esPendienteReab(estado) {
  const e = normalizarEstado(estado);
  return e.includes("pend");
}

function esPedidoPorRevisar(estado) {
  const e = normalizarEstado(estado);
  return e === "en preparación" || e === "en preparacion";
}

export default function NotificationsModal({ open, onClose }) {
  const navigate = useNavigate();

  const [reabastecimientos, setReabastecimientos] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [actingKey, setActingKey] = useState(null);
  const [error, setError] = useState(null);

  const pendientesReab = useMemo(() => {
    const hasEstado = reabastecimientos.some((x) => x.estado);
    if (!hasEstado) return reabastecimientos;
    return reabastecimientos.filter((x) => esPendienteReab(x.estado));
  }, [reabastecimientos]);

  const pedidosPorRevisar = useMemo(() => {
    const hasEstado = pedidos.some((x) => x.estado);
    if (!hasEstado) return [];
    return pedidos.filter((x) => esPedidoPorRevisar(x.estado));
  }, [pedidos]);

  const totalPedidosPorRevisar = pedidosPorRevisar.length;

  const cargar = async () => {
    try {
      setError(null);
      setLoading(true);

      const [reabData, pedidosData] = await Promise.all([
        getReabastecimientos(),
        getPedidosClientes(),
      ]);

      setReabastecimientos(Array.isArray(reabData) ? reabData : []);
      setPedidos(Array.isArray(pedidosData) ? pedidosData : []);
    } catch (e) {
      setError(e?.message || "No se pudieron cargar las notificaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) cargar();
  }, [open]);

  const onAprobarReab = async (id) => {
    if (!window.confirm("¿Aprobar este reabastecimiento?")) return;
    try {
      setActingKey(`reab-${id}`);
      setError(null);
      await aprobarReabastecimiento(id);
      await cargar();
    } catch (e) {
      setError(e?.message || "No se pudo aprobar");
    } finally {
      setActingKey(null);
    }
  };

  const onCancelarReab = async (id) => {
    if (!window.confirm("¿Cancelar este reabastecimiento?")) return;
    try {
      setActingKey(`reab-${id}`);
      setError(null);
      await cancelarReabastecimiento(id);
      await cargar();
    } catch (e) {
      setError(e?.message || "No se pudo cancelar");
    } finally {
      setActingKey(null);
    }
  };

  const irAModuloPedidos = () => {
    onClose();
    navigate("/pedidos-clientes");
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-[60]">
      <DialogBackdrop className="fixed inset-0 bg-gray-900/60" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          <DialogPanel className="w-full max-w-4xl rounded-xl bg-white shadow-xl outline outline-gray-900/10">
            <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Notificaciones
                </h3>
                <p className="text-xs text-gray-500">
                  Reabastecimientos y seguimiento de pedidos
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
              <div className="mx-4 mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:mx-6">
                {error}
              </div>
            )}

            <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Reabastecimientos pendientes
                </h4>

                <div className="mt-3 space-y-3">
                  {loading ? (
                    <div className="text-sm text-gray-600">Cargando…</div>
                  ) : pendientesReab.length === 0 ? (
                    <div className="text-sm text-gray-600">
                      No hay reabastecimientos pendientes.
                    </div>
                  ) : (
                    pendientesReab.map((n) => (
                      <div key={n.id} className="rounded-lg border border-gray-200 p-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {n.nombreProducto}{" "}
                          <span className="font-normal text-gray-500">
                            ({n.codigoProducto})
                          </span>
                        </div>

                        <div className="mt-1 text-xs text-gray-600">
                          ProductoId: {n.productoId} · Cantidad sugerida: {n.cantidadSugerida}
                        </div>

                        <div className="mt-1 text-xs text-gray-500">
                          Estado: {n.estado || "—"} · {fmtDate(n.timestamp)}
                        </div>

                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => onAprobarReab(n.id)}
                            disabled={actingKey === `reab-${n.id}`}
                            className="rounded-md bg-black px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                          >
                            Aprobar
                          </button>

                          <button
                            type="button"
                            onClick={() => onCancelarReab(n.id)}
                            disabled={actingKey === `reab-${n.id}`}
                            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  Pedidos por revisar
                </h4>

                <div className="mt-3 space-y-3">
                  {loading ? (
                    <div className="text-sm text-gray-600">Cargando…</div>
                  ) : totalPedidosPorRevisar === 0 ? (
                    <div className="text-sm text-gray-600">
                      No hay pedidos en preparación.
                    </div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="text-sm font-semibold text-gray-900">
                        Tienes {totalPedidosPorRevisar} pedido{totalPedidosPorRevisar !== 1 ? "s" : ""} en preparación
                      </div>

                      <div className="mt-2 text-sm text-gray-600">
                        Ingresa al módulo de seguimiento para revisar, confirmar o cancelar pedidos.
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={irAModuloPedidos}
                          className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                        >
                          Ir a seguimiento de pedidos
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}