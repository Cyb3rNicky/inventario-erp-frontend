import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { getReabastecimientos } from "../../services/Reabastecimientos/getReabastecimientos";
import { aprobarReabastecimiento } from "../../services/Reabastecimientos/aprobarReabastecimiento";
import { cancelarReabastecimiento } from "../../services/Reabastecimientos/cancelarReabastecimiento";
import { getPedidosClientes } from "../../services/PedidosClientes/getPedidosClientes";
import { confirmarPedidoCliente } from "../../services/PedidosClientes/confirmarPedidoCliente";
import { cancelarPedidoCliente } from "../../services/PedidosClientes/cancelarPedidoCliente";
import { useNavigate } from "react-router-dom";

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
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
    return reabastecimientos.filter((x) =>
      String(x.estado).toLowerCase().includes("pend")
    );
  }, [reabastecimientos]);

  const pendientesPedidos = useMemo(() => {
    const hasEstado = pedidos.some((x) => x.estado);
    if (!hasEstado) return pedidos;
    return pedidos.filter((x) =>
      String(x.estado).toLowerCase().includes("pend")
    );
  }, [pedidos]);

  const cargar = async () => {
    try {
      setError(null);
      setLoading(true);

      const [reabData, pedidosData] = await Promise.all([
        getReabastecimientos(),
        getPedidosClientes(),
      ]);

      setReabastecimientos(reabData);
      setPedidos(pedidosData);
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

  const onConfirmarPedido = async (id) => {
    if (!window.confirm("¿Confirmar este pedido?")) return;
    try {
      setActingKey(`pedido-${id}`);
      setError(null);
      await confirmarPedidoCliente(id);
      await cargar();
    } catch (e) {
      setError(e?.message || "No se pudo confirmar el pedido");
    } finally {
      setActingKey(null);
    }
  };

  const onCancelarPedido = async (id) => {
    if (!window.confirm("¿Cancelar este pedido?")) return;
    try {
      setActingKey(`pedido-${id}`);
      setError(null);
      await cancelarPedidoCliente(id);
      await cargar();
    } catch (e) {
      setActingKey(null);
      setError(e?.message || "No se pudo cancelar el pedido");
    } finally {
      setActingKey(null);
    }
  };

  const irAPedido = (id) => {
    onClose();
    navigate(`/pedidos-clientes/edit/${id}`);
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-60">
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
                  Reabastecimientos y pedidos pendientes
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
                  Pedidos pendientes
                </h4>

                <div className="mt-3 space-y-3">
                  {loading ? (
                    <div className="text-sm text-gray-600">Cargando…</div>
                  ) : pendientesPedidos.length === 0 ? (
                    <div className="text-sm text-gray-600">
                      No hay pedidos pendientes.
                    </div>
                  ) : (
                    pendientesPedidos.map((p) => (
                      <div key={p.id} className="rounded-lg border border-gray-200 p-4">
                        <div className="text-sm font-semibold text-gray-900">
                          Pedido #{p.id}
                        </div>

                        <div className="mt-1 text-xs text-gray-600">
                          ClienteId: {p.clienteId} · Total: Q{Number(p.totalVenta ?? 0).toFixed(2)}
                        </div>

                        <div className="mt-1 text-xs text-gray-600">
                          Detalles: {p.detalles.length}
                        </div>

                        <div className="mt-1 text-xs text-gray-500">
                          Estado: {p.estado || "—"} · {fmtDate(p.timestamp)}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => irAPedido(p.id)}
                            className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-300"
                          >
                            Ver pedido
                          </button>

                          <button
                            type="button"
                            onClick={() => onConfirmarPedido(p.id)}
                            disabled={actingKey === `pedido-${p.id}`}
                            className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                          >
                            Confirmar
                          </button>

                          <button
                            type="button"
                            onClick={() => onCancelarPedido(p.id)}
                            disabled={actingKey === `pedido-${p.id}`}
                            className="rounded-md bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ))
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