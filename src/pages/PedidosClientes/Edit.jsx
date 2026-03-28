import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPedidoClienteById } from "../../services/PedidosClientes/getPedidoClienteById";
import { updatePedidoCliente } from "../../services/PedidosClientes/updatePedidoCliente";

export default function EditarPedidoCliente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    clienteId: "",
    estado: "",
    timestamp: "",
    detalles: [],
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError(null);

    getPedidoClienteById(id)
      .then((p) => {
        if (!mounted) return;
        setForm({
          clienteId: String(p.clienteId ?? ""),
          estado: p.estado ?? "",
          timestamp: p.timestamp ?? "",
          detalles: Array.isArray(p.detalles)
            ? p.detalles.map((d) => ({
                productoId: String(d.productoId ?? ""),
                nombreProducto: d.nombreProducto ?? "",
                cantidad: String(d.cantidad ?? ""),
                timestamp: d.timestamp ?? "",
              }))
            : [],
        });
      })
      .catch((e) => setError(e.message || "No se pudo cargar el pedido"))
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.clienteId === "" || isNaN(Number(form.clienteId))) {
      return setError("Cliente inválido");
    }

    if (!form.estado.trim()) {
      return setError("El estado es obligatorio");
    }

    if (!Array.isArray(form.detalles) || form.detalles.length === 0) {
      return setError("Debe existir al menos un detalle");
    }

    try {
      setSubmitting(true);

      await updatePedidoCliente({
        id,
        clienteId: Number(form.clienteId),
        estado: form.estado.trim(),
        timestamp: form.timestamp || new Date().toISOString(),
        detalles: form.detalles.map((d) => ({
          productoId: Number(d.productoId),
          cantidad: Number(d.cantidad),
          timestamp: d.timestamp || new Date().toISOString(),
        })),
      });

      navigate("/pedidos-clientes", { replace: true });
    } catch (err) {
      setError(err?.message || "No se pudo actualizar el pedido");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-sm text-gray-600">Cargando…</div>;

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-10">
        <div className="border-b border-gray-900/10 pb-10">
          <h2 className="text-base/7 font-semibold text-gray-900">
            Editar pedido #{id}
          </h2>

          {error && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="clienteId" className="block text-sm/6 font-medium text-gray-900">
                Cliente ID
              </label>
              <input
                id="clienteId"
                name="clienteId"
                type="number"
                value={form.clienteId}
                disabled
                className="mt-2 block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-700 outline-1 outline-gray-300 sm:text-sm/6"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="estado" className="block text-sm/6 font-medium text-gray-900">
                Estado
              </label>
              <input
                id="estado"
                name="estado"
                type="text"
                value={form.estado}
                onChange={onChange}
                required
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 outline-gray-300 sm:text-sm/6"
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Detalles</h3>
            </div>

            <div className="mt-4 space-y-4">
              {form.detalles.map((d, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4 sm:grid-cols-3"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Producto
                    </label>
                    <input
                      type="text"
                      value={d.nombreProducto || `Producto ${d.productoId}`}
                      disabled
                      className="mt-2 block w-full rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 outline-1 outline-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      value={d.cantidad}
                      disabled
                      className="mt-2 block w-full rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 outline-1 outline-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Producto ID
                    </label>
                    <input
                      type="number"
                      value={d.productoId}
                      disabled
                      className="mt-2 block w-full rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 outline-1 outline-gray-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-2">
          <Link
            to="/pedidos-clientes"
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </form>
  );
}