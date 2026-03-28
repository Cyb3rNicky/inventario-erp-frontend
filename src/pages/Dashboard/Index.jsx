import { useEffect, useState } from "react";
import { getResumenInventario } from "../../services/Dashboard/getResumenInventario";
import { getProductosMasVendidos } from "../../services/Dashboard/getProductosMasVendidos";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function fmtMoney(value) {
  return `Q${Number(value ?? 0).toFixed(2)}`;
}

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

function KpiCard({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {subtitle ? <p className="mt-2 text-xs text-gray-500">{subtitle}</p> : null}
    </div>
  );
}

const cantidadColors = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#1d4ed8"];
const ingresoColors = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#047857"];

export default function Dashboard() {
  const [resumen, setResumen] = useState(null);
  const [masVendidos, setMasVendidos] = useState([]);
  const [loadingResumen, setLoadingResumen] = useState(false);
  const [loadingVendidos, setLoadingVendidos] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    top: 10,
  });

  const cargarResumen = async () => {
    try {
      setLoadingResumen(true);
      const data = await getResumenInventario();
      setResumen(data);
    } catch (e) {
      setError(e.message || "No se pudo cargar el resumen de inventario");
    } finally {
      setLoadingResumen(false);
    }
  };

  const cargarMasVendidos = async (customFilters = filters) => {
    try {
      setLoadingVendidos(true);
      const data = await getProductosMasVendidos(customFilters);
      setMasVendidos(data);
    } catch (e) {
      setError(e.message || "No se pudieron cargar los productos más vendidos");
    } finally {
      setLoadingVendidos(false);
    }
  };

  useEffect(() => {
    setError(null);
    cargarResumen();
    cargarMasVendidos();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({
      ...f,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    await cargarMasVendidos({
      ...filters,
      top: Number(filters.top || 10),
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Resumen general del inventario y productos más vendidos
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Resumen de inventario</h2>
          {resumen?.generatedAt ? (
            <span className="text-xs text-gray-500">
              Actualizado: {fmtDate(resumen.generatedAt)}
            </span>
          ) : null}
        </div>

        {loadingResumen ? (
          <div className="text-sm text-gray-600">Cargando resumen…</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <KpiCard
              title="Total de productos"
              value={resumen?.totalProductos ?? 0}
            />
            <KpiCard
              title="Unidades totales"
              value={resumen?.unidadesTotales ?? 0}
            />
            <KpiCard
              title="Productos bajo stock"
              value={resumen?.productosBajoStock ?? 0}
            />
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Productos más vendidos</h2>
            <p className="text-sm text-gray-500">
              Análisis de rotación y generación de ingresos
            </p>
          </div>

          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-700">Top</label>
              <input
                type="number"
                name="top"
                min="1"
                value={filters.top}
                onChange={onChange}
                className="mt-1 block w-full rounded-md bg-white px-3 py-2 text-sm outline outline-1 outline-gray-300"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Aplicar
              </button>
            </div>
          </form>
        </div>

        {loadingVendidos ? (
          <div className="text-sm text-gray-600">Cargando productos más vendidos…</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                  Top por cantidad vendida
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={masVendidos}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nombre" hide />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cantidadVendida" radius={[6, 6, 0, 0]}>
                        {masVendidos.map((_, index) => (
                          <Cell
                            key={`cantidad-${index}`}
                            fill={cantidadColors[index % cantidadColors.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                  Top por ingreso total
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={masVendidos}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nombre" hide />
                      <YAxis />
                      <Tooltip formatter={(value) => fmtMoney(value)} />
                      <Bar dataKey="ingresoTotal" radius={[6, 6, 0, 0]}>
                        {masVendidos.map((_, index) => (
                          <Cell
                            key={`ingreso-${index}`}
                            fill={ingresoColors[index % ingresoColors.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Tabla de productos más vendidos
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="py-3 pr-3 pl-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0">
                        Producto
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Código
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Categoría
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Cantidad vendida
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Ingreso total
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Total pedidos
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {masVendidos.length > 0 ? (
                      masVendidos.map((item) => (
                        <tr key={item.productoId}>
                          <td className="py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:pl-0">
                            {item.nombre}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-700">{item.codigo}</td>
                          <td className="px-3 py-4 text-sm text-gray-700">{item.categoria}</td>
                          <td className="px-3 py-4 text-sm text-gray-700">{item.cantidadVendida}</td>
                          <td className="px-3 py-4 text-sm text-gray-700">{fmtMoney(item.ingresoTotal)}</td>
                          <td className="px-3 py-4 text-sm text-gray-700">{item.totalPedidos}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-3 py-10 text-center text-sm text-gray-500">
                          No hay datos para mostrar.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}