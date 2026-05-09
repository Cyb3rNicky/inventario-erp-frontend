import { Link, useNavigate } from "react-router-dom";
import { createProducto } from "../../services/Productos/createProducto";
import { useEffect, useState } from "react";
import { getCategorias } from "../../services/Categorias/getCategorias";
import { getBodegas } from "../../services/Bodegas/getBodegas";

export default function CrearProducto() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    categoriaId: "",
    bodegaId: "",
    descripcion: "",
    precioVenta: "",
    costoUnitario: "",
    stockActual: "",
    stockMinimo: "",
    estado: true,
    creadoPorId: 0,
  });

  const [categorias, setCategorias] = useState([]);
  const [bodegas, setBodegas] = useState([]);

  useEffect(() => {
    Promise.all([getCategorias(), getBodegas()])
      .then(([cats, bods]) => {
        setCategorias(cats);
        setBodegas(bods);
      })
      .catch(() => setError("No se pudieron cargar categorías o bodegas"));
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.nombre.trim()) return setError("El nombre es obligatorio");
    if (!form.codigo.trim()) return setError("El código es obligatorio");
    if (!form.categoriaId) return setError("La categoría es obligatoria");
    if (!form.bodegaId) return setError("La bodega es obligatoria");

    const nums = ["precioVenta", "costoUnitario", "stockActual", "stockMinimo"];
    for (const k of nums) {
      if (form[k] === "" || isNaN(Number(form[k]))) return setError(`Campo inválido: ${k}`);
    }

    try {
      setSubmitting(true);
      await createProducto({
        ...form,
        precioVenta: Number(form.precioVenta),
        costoUnitario: Number(form.costoUnitario),
        stockActual: Number(form.stockActual),
        stockMinimo: Number(form.stockMinimo),
      });

      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.message || "No se pudo crear el producto");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-10">
        <div className="border-b border-gray-900/10 pb-10">
          <h2 className="text-base/7 font-semibold text-gray-900">Crear producto</h2>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="nombre" className="block text-sm/6 font-medium text-gray-900">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={onChange}
                required
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="codigo" className="block text-sm/6 font-medium text-gray-900">Código</label>
              <input
                id="codigo"
                name="codigo"
                type="text"
                value={form.codigo}
                onChange={onChange}
                required
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="categoriaId" className="block text-sm/6 font-medium text-gray-900">
                Categoría
              </label>
              <select
                id="categoriaId"
                name="categoriaId"
                value={form.categoriaId}
                onChange={onChange}
                required
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 outline-gray-300 sm:text-sm/6"
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="bodegaId" className="block text-sm/6 font-medium text-gray-900">
                Bodega
              </label>
              <select
                id="bodegaId"
                name="bodegaId"
                value={form.bodegaId}
                onChange={onChange}
                required
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 outline-gray-300 sm:text-sm/6"
              >
                <option value="">Seleccione una bodega</option>
                {bodegas.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="descripcion" className="block text-sm/6 font-medium text-gray-900">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows={3}
                value={form.descripcion}
                onChange={onChange}
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="precioVenta" className="block text-sm/6 font-medium text-gray-900">Precio venta</label>
              <input
                id="precioVenta"
                name="precioVenta"
                type="number"
                step="0.01"
                value={form.precioVenta}
                onChange={onChange}
                required
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                placeholder="0.00"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="costoUnitario" className="block text-sm/6 font-medium text-gray-900">Costo unitario</label>
              <input
                id="costoUnitario"
                name="costoUnitario"
                type="number"
                step="0.01"
                value={form.costoUnitario}
                onChange={onChange}
                required
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                placeholder="0.00"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="stockActual" className="block text-sm/6 font-medium text-gray-900">Stock actual</label>
              <input
                id="stockActual"
                name="stockActual"
                type="number"
                value={form.stockActual}
                onChange={onChange}
                required
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                placeholder="0"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="stockMinimo" className="block text-sm/6 font-medium text-gray-900">Stock mínimo</label>
              <input
                id="stockMinimo"
                name="stockMinimo"
                type="number"
                value={form.stockMinimo}
                onChange={onChange}
                required
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                placeholder="0"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="creadoPorId" className="block text-sm/6 font-medium text-gray-900">Creado por (ID)</label>
              <input
                id="creadoPorId"
                name="creadoPorId"
                type="number"
                value={form.creadoPorId}
                onChange={onChange}
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
              />
            </div>

            <div className="sm:col-span-3 flex items-center gap-3 mt-8">
              <input
                id="estado"
                name="estado"
                type="checkbox"
                checked={form.estado}
                onChange={onChange}
                className="h-4 w-4"
              />
              <label htmlFor="estado" className="text-sm font-medium text-gray-900">Activo</label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-2">
          <Link
            to="/"
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