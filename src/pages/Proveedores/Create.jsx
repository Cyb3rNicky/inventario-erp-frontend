import { Link, useNavigate } from "react-router-dom";
import { createProveedor } from "../../services/Proveedores/createProveedor";
import { useEffect, useState } from "react";
import { getCategorias } from "../../services/Categorias/getCategorias";

export default function CrearProveedor() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    categoriaId: "",
    telefono: "",
    email: "",
    direccion: "",
    estado: true,
  });

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    getCategorias()
      .then(setCategorias)
      .catch(() => setError("No se pudieron cargar las categorías"));
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
    if (!form.categoriaId) return setError("La categoría es obligatoria");
    if (!form.telefono.trim()) return setError("El teléfono es obligatorio");
    if (!form.email.trim()) return setError("El email es obligatorio");
    if (!form.direccion.trim()) return setError("La dirección es obligatoria");

    try {
      setSubmitting(true);
      await createProveedor(form);
      navigate("/proveedores", { replace: true });
    } catch (err) {
      setError(err?.message || "No se pudo crear el proveedor");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-10">
        <div className="border-b border-gray-900/10 pb-10">
          <h2 className="text-base/7 font-semibold text-gray-900">Crear proveedor</h2>

          {error && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 outline-gray-300 sm:text-sm/6"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="categoriaId" className="block text-sm/6 font-medium text-gray-900">
                Categoría que provee
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
              <label htmlFor="telefono" className="block text-sm/6 font-medium text-gray-900">Teléfono</label>
              <input
                id="telefono"
                name="telefono"
                type="text"
                value={form.telefono}
                onChange={onChange}
                required
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 outline-gray-300 sm:text-sm/6"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 outline-gray-300 sm:text-sm/6"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="direccion" className="block text-sm/6 font-medium text-gray-900">Dirección</label>
              <input
                id="direccion"
                name="direccion"
                type="text"
                value={form.direccion}
                onChange={onChange}
                required
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base outline-1 outline-gray-300 sm:text-sm/6"
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
            to="/proveedores"
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