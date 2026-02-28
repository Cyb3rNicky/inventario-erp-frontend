import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductoById } from "../../services/Productos/getProductoById";
import { updateProducto } from "../../services/Productos/updateProducto";

export default function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    codigo: "",
    categoria: "",
    ubicacion: "",
    descripcion: "",
    precioVenta: "",
    costoUnitario: "",
    stockActual: "",
    stockMinimo: "",
    estado: true,
    creadoPorId: 0,
    timestamp: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError(null);

    getProductoById(id)
      .then((p) => {
        if (!mounted) return;
        setForm({
          nombre: p.nombre ?? "",
          codigo: p.codigo ?? "",
          categoria: p.categoria ?? "",
          ubicacion: p.ubicacion ?? "",
          descripcion: p.descripcion ?? "",
          precioVenta: String(p.precioVenta ?? 0),
          costoUnitario: String(p.costoUnitario ?? 0),
          stockActual: String(p.stockActual ?? 0),
          stockMinimo: String(p.stockMinimo ?? 0),
          estado: Boolean(p.estado ?? true),
          creadoPorId: Number(p.creadoPorId ?? 0),
          timestamp: p.timestamp ?? "",
        });
      })
      .catch((e) => setError(e.message || "No se pudo cargar el producto"))
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

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
    if (!form.categoria.trim()) return setError("La categoría es obligatoria");
    if (!form.ubicacion.trim()) return setError("La ubicación es obligatoria");

    const nums = ["precioVenta", "costoUnitario", "stockActual", "stockMinimo"];
    for (const k of nums) {
      if (form[k] === "" || isNaN(Number(form[k]))) return setError(`Campo inválido: ${k}`);
    }

    try {
      setSubmitting(true);
      await updateProducto({
        id,
        ...form,
        precioVenta: Number(form.precioVenta),
        costoUnitario: Number(form.costoUnitario),
        stockActual: Number(form.stockActual),
        stockMinimo: Number(form.stockMinimo),
      });

      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.message || "No se pudo actualizar el producto");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-sm text-gray-600">Cargando…</div>;

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-10">
        <div className="border-b border-gray-900/10 pb-10">
          <h2 className="text-base/7 font-semibold text-gray-900">Editar producto #{form.codigo}</h2>

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
              <label htmlFor="categoria" className="block text-sm/6 font-medium text-gray-900">Categoría</label>
              <input
                id="categoria"
                name="categoria"
                type="text"
                value={form.categoria}
                onChange={onChange}
                required
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="ubicacion" className="block text-sm/6 font-medium text-gray-900">Ubicación</label>
              <input
                id="ubicacion"
                name="ubicacion"
                type="text"
                value={form.ubicacion}
                onChange={onChange}
                required
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
              />
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