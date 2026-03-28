import { apiFetch } from "../../utils/apiFetch";

export const deleteProveedor = async (id) => {
  const url = `https://inventarioapi-the3.onrender.com/api/Proveedores/${id}`;
  await apiFetch(url, { method: "DELETE" });
  return true;
};