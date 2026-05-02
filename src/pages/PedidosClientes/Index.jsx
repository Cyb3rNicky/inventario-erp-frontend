import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPedidosClientes } from "../../services/PedidosClientes/getPedidosClientes";
import { deletePedidoCliente } from "../../services/PedidosClientes/deletePedidoCliente";
import { confirmarPedidoCliente } from "../../services/PedidosClientes/confirmarPedidoCliente";
import { cancelarPedidoCliente } from "../../services/PedidosClientes/cancelarPedidoCliente";

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

function normalizarEstado(estado) {
  return String(estado || "").trim().toLowerCase();
}

function esEstadoFinal(estado) {
  const e = normalizarEstado(estado);
  return e === "confirmado" || e === "cancelado" || e === "entregado";
}

function esCancelado(estado) {
  return normalizarEstado(estado) === "cancelado";
}

function esEnPreparacion(estado) {
  const e = normalizarEstado(estado);
  return e === "en preparación" || e === "en preparacion";
}

export default function PedidosClientes() {
  const [pedidos, setPedidos] = useState([]);
  const [estado, setEstado] = useState("");
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState(null);
  const [error, setError] = useState(null);

  const cargar = async (estadoParam = estado) => {
    try {
      setError(null);
      setLoading(true);
      const data = await getPedidosClientes(estadoParam);
      setPedidos(data);
    } catch (e) {
      setError(e.message || "No se pudieron cargar los pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar("");
  }, []);

  const onFiltrar = async (e) => {
    e.preventDefault();
    await cargar(estado);
  };

  const onConfirmar = async (id) => {
    if (!window.confirm("¿Confirmar este pedido?")) return;
    try {
      setActingId(id);
      setError(null);
      await confirmarPedidoCliente(id);
      await cargar();
    } catch (e) {
      setError(e.message || "No se pudo confirmar el pedido");
    } finally {
      setActingId(null);
    }
  };

  const onCancelar = async (id) => {
    if (!window.confirm("¿Cancelar este pedido?")) return;
    try {
      setActingId(id);
      setError(null);
      await cancelarPedidoCliente(id);
      await cargar();
    } catch (e) {
      setError(e.message || "No se pudo cancelar el pedido");
    } finally {
      setActingId(null);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("¿Eliminar este pedido?")) return;
    try {
      setActingId(id);
      setError(null);
      await deletePedidoCliente(id);
      await cargar();
    } catch (e) {
      setError(e.message || "No se pudo eliminar el pedido");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Pedidos de clientes</h1>
        </div>
      </div>

      <form onSubmit={onFiltrar} className="mt-6 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          placeholder="Filtrar por estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="block w-full max-w-sm rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 outline-gray-300"
        />
        <button
          type="submit"
          className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Filtrar
        </button>
        <button
          type="button"
          onClick={() => {
            setEstado("");
            cargar("");
          }}
          className="rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-300"
        >
          Limpiar
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="py-3 pr-3 pl-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0">
                ID
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Cliente
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Productos
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Cantidad
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Estado
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Total
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Fecha
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Detalles
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {pedidos.length > 0 ? (
              pedidos.map((p) => {
                const estadoFinal = esEstadoFinal(p.estado);
                const cancelado = esCancelado(p.estado);
                const enPreparacion = esEnPreparacion(p.estado);

                return (
                  <tr key={p.id}>
                    <td className="py-4 pr-3 pl-4 align-top text-sm font-medium text-gray-900 sm:pl-0">
                      {p.id}
                    </td>

                    <td className="px-3 py-4 align-top text-sm text-gray-700">
                      {p.clienteId}
                    </td>

                    <td className="px-3 py-4 align-top text-sm text-gray-700">
                      <div className="space-y-1">
                        {p.detalles?.length > 0 ? (
                          p.detalles.map((d, index) => (
                            <div key={d.id ?? `${p.id}-producto-${index}`}>
                              {d.nombreProducto || `Producto ${d.productoId}`}
                            </div>
                          ))
                        ) : (
                          <span>—</span>
                        )}
                      </div>
                    </td>

                    <td className="px-3 py-4 align-top text-sm text-gray-700">
                      <div className="space-y-1">
                        {p.detalles?.length > 0 ? (
                          p.detalles.map((d, index) => (
                            <div key={d.id ?? `${p.id}-cantidad-${index}`}>
                              {d.cantidad}
                            </div>
                          ))
                        ) : (
                          <span>—</span>
                        )}
                      </div>
                    </td>

                    <td className="px-3 py-4 align-top text-sm text-gray-700">
                      {p.estado}
                    </td>

                    <td className="px-3 py-4 align-top text-sm text-gray-700">
                      Q{Number(p.total ?? 0).toFixed(2)}
                    </td>

                    <td className="px-3 py-4 align-top text-sm text-gray-700">
                      {fmtDate(p.timestamp)}
                    </td>

                    <td className="px-3 py-4 align-top text-sm text-gray-700">
                      {p.detalles.length}
                    </td>

                    <td className="px-3 py-4 align-top text-sm">
                      <div className="grid min-w-180px grid-cols-2 gap-2">
                        {!enPreparacion && (
                          <Link
                            to={`/pedidos-clientes/edit/${p.id}`}
                            className="inline-flex items-center justify-center rounded-md bg-black px-3 py-2 text-xs font-semibold text-white hover:bg-gray-700"
                          >
                            Editar
                          </Link>
                        )}

                        {!estadoFinal && (
                          <>
                            <button
                              type="button"
                              onClick={() => onConfirmar(p.id)}
                              disabled={actingId === p.id}
                              className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                            >
                              Confirmar
                            </button>

                            <button
                              type="button"
                              onClick={() => onCancelar(p.id)}
                              disabled={actingId === p.id}
                              className="inline-flex items-center justify-center rounded-md bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
                            >
                              Cancelar
                            </button>
                          </>
                        )}

                        {cancelado && (
                          <button
                            type="button"
                            onClick={() => onDelete(p.id)}
                            disabled={actingId === p.id}
                            className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="px-3 py-10 text-center text-sm text-gray-500">
                  {loading ? "Cargando..." : "No hay pedidos para mostrar."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}