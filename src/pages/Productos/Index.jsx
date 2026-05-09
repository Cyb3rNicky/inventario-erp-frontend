import { useEffect, useState } from 'react'
import { getProductos } from '../../services/Productos/getProductos'
import { deleteProducto } from '../../services/Productos/deleteProducto'
import { Link } from 'react-router-dom'

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargar = () => {
    setError(null);
    getProductos()
      .then(setProductos)
      .catch((e) => setError(e.message || 'Error al cargar productos'));
  };

  useEffect(() => { cargar(); }, []);

  const onDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      setLoading(true);
      await deleteProducto(id);
      cargar();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Productos</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/productos/create"
            className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-500"
          >
            Crear producto
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th className="py-3 pr-3 pl-4 text-left text-xs font-medium tracking-wide text-gray-500 uppercase sm:pl-0">ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Nombre</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Código</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Categoría</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Bodega</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Stock</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Stock Mínimo</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Precio Venta</th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {productos.length > 0 ? (
              productos.map((p) => (
                <tr key={p.id}>
                  <td className="py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:pl-0">{p.id}</td>
                  <td className="px-3 py-4 text-sm text-gray-900">{p.nombre}</td>
                  <td className="px-3 py-4 text-sm text-gray-900">{p.codigo}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">{p.categoria}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">{p.bodegaNombre}</td>
                  <td className="px-3 py-4 text-sm text-gray-700">{p.stockActual}</td>

                  <td className="px-3 py-4 text-sm text-gray-700">
                    {p.stockMinimo}
                    {p.stockBajo ? <span className="ml-2 text-red-600 font-semibold">BAJO</span> : <span className="ml-2 text-green-600 font-semibold">NORMAL</span>}
                  </td>

                  <td className="px-3 py-4 text-sm text-gray-700">
                    Q{Number(p.precioVenta ?? 0).toFixed(2)}
                  </td>

                  <td className="px-3 py-4 text-sm flex gap-2">
                    <Link
                      to={`/productos/edit/${p.id}`}
                      className="rounded-md bg-black px-3 py-1 text-sm font-semibold text-white hover:bg-gray-500"
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
                <td colSpan={8} className="px-3 py-10 text-center text-sm text-gray-500">
                  {error ? '—' : 'No hay productos para mostrar.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
