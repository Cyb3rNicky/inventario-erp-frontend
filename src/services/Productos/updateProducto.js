import { apiFetch } from "../../utils/apiFetch";

export const updateProducto = async (form) => {
  const id = Number(form.id);
  const url = `https://inventarioapi-the3.onrender.com/api/Productos/${id}`;

  const payload = {
    nombre:        String(form.nombre ?? "").trim(),
    codigo:        String(form.codigo ?? "").trim(),
    categoria:     String(form.categoria ?? "").trim(),
    ubicacion:     String(form.ubicacion ?? "").trim(),
    descripcion:   String(form.descripcion ?? "").trim(),
    precioVenta:   Number(form.precioVenta),
    costoUnitario: Number(form.costoUnitario),
    stockActual:   Number(form.stockActual),
    stockMinimo:   Number(form.stockMinimo),
    estado:        Boolean(form.estado),
    creadoPorId:   Number(form.creadoPorId ?? 0),
    timestamp:     form.timestamp || new Date().toISOString(),
  };

  return apiFetch(url, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};