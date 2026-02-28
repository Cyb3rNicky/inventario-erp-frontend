import { Navigate } from "react-router-dom";
import { isLogged, isAdmin } from "../utils/auth";

/**
 * Protege rutas según login y rol de admin
 * @param {React.Component} children - Componente a renderizar
 * @param {boolean} admin - Si true, solo usuarios admin pueden acceder
 */
export default function ProtectedRoute({ children, admin = false }) {
  // Si no está logueado -> redirige a login
  if (!isLogged()) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere admin pero no lo es -> redirige a home
  if (admin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Usuario logueado y autorizado
  return children;
}
