import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProveedores } from "../../services/Proveedores/getProveedores";
import { getProveedorByNombre } from "../../services/Proveedores/getProveedorByNombre";
import { deleteProveedor } from "../../services/Proveedores/deleteProveedor";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargar = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getProveedores();
      setProveedores(data);
    } catch (e) {
      setError(e.message || "Error al cargar proveedores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const onBuscar = async (e) => {
    e.preventDefault();

    if (!search.trim()) {
      cargar();
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const data = await getProveedorByNombre(search.trim());
      setProveedores(data);
    } catch (e) {
      setError(e.message || "No se pudo buscar el proveedor");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este proveedor?")) return;

    try {
      setLoading(true);
      await deleteProveedor(id);
      await cargar();
    } catch (e) {
      setError(e.message || "No se pudo eliminar el proveedor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Proveedores</h1>
        </div>

        <div className="mt-4 sm:mt-0">
          <Link
            to="/proveedores/create"
            className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Crear proveedor
          </Link>
        </div>
      </div>

      <form onSubmit={onBuscar} className="mt-6 flex gap-2">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full max-w-md rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 outline-gray-300"
        />
        <button
          type="submit"
          className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700"
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={() => {
            setSearch("");
            cargar();
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
              <th className="py-3 pr-3 pl-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0">ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Nombre</th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Teléfono</th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Email</th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Dirección</th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Estado</th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {proveedores.length > 0 ? (
              proveedores.map((p) => (
                <tr key={p.id}>
                  <td className="py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:pl-0">{p.id}</td>
                  <td className="px-3 py-4 text-sm text-gray-900">{p.nombre}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">{p.telefono}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">{p.email}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">{p.direccion}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">
                    {p.estado ? "Activo" : "Inactivo"}
                  </td>
                  <td className="px-3 py-4 text-sm flex gap-2">
                    <Link
                      to={`/proveedores/edit/${p.id}`}
                      className="rounded-md bg-black px-3 py-1 text-sm font-semibold text-white hover:bg-gray-700"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => onDelete(p.id)}
                      disabled={loading}
                      className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-sm text-gray-500">
                  {loading ? "Cargando..." : "No hay proveedores para mostrar."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}