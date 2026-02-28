import { apiFetch } from "../../utils/apiFetch";

export const deleteProducto = async (id) => {
  const url = `https://inventarioapi-the3.onrender.com/api/Productos/${id}`;
  await apiFetch(url, { method: "DELETE" });
  return true;
};
