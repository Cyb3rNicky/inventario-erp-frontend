import { apiFetch } from "../../utils/apiFetch";

export const createProducto = async (form) => {
  const url = "https://inventarioapi-the3.onrender.com/api/Productos";

  const payload = {
    nombre: String(form.nombre ?? "").trim(),
    categoriaId: Number(form.categoriaId),
    bodegaId: Number(form.bodegaId),
    descripcion: String(form.descripcion ?? "").trim(),
    precioVenta: Number(form.precioVenta),
    costoUnitario: Number(form.costoUnitario),
    stockActual: Number(form.stockActual),
    stockMinimo: Number(form.stockMinimo),
    estado: Boolean(form.estado),
    creadoPorId: Number(form.creadoPorId ?? 0),
    timestamp: form.timestamp || new Date().toISOString(),
  };

  return apiFetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};