import { apiFetch } from "../../utils/apiFetch";
import { getProductos } from "../Productos/getProductos";

export const getPedidosClientes = async (estado = "") => {
  const base = "https://inventarioapi-the3.onrender.com/api/PedidosClientes";

  const qs = new URLSearchParams();
  if (estado?.trim()) qs.set("estado", estado.trim());

  const url = qs.toString() ? `${base}?${qs.toString()}` : base;

  const [resp, productos] = await Promise.all([
    apiFetch(url, { method: "GET" }),
    getProductos(),
  ]);

  const productosMap = new Map(
    productos.map((p) => [Number(p.id), p.nombre])
  );

  const data = Array.isArray(resp) ? resp : [];

  return data.map((p) => ({
    id: p.id,
    clienteId: p.clienteId ?? 0,
    estado: p.estado ?? "",
    timestamp: p.timestamp ?? "",
    total: p.total ?? p.totalVenta ?? 0,
    detalles: Array.isArray(p.detalles)
      ? p.detalles.map((d) => {
          const productoId = Number(d.productoId ?? 0);

          return {
            id: d.id,
            productoId,
            nombreProducto:
              d.nombreProducto ||
              d.productoNombre ||
              d.nombre ||
              d.producto?.nombre ||
              productosMap.get(productoId) ||
              "Producto sin nombre",
            cantidad: d.cantidad ?? 0,
            precioUnitario: d.precioUnitario ?? 0,
            subtotal: d.subtotal ?? 0,
            timestamp: d.timestamp ?? "",
          };
        })
      : [],
  }));
};