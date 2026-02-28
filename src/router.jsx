import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";

const Login = lazy(() => import("./pages/Login.jsx"));
const Productos = lazy(() => import("./pages/Productos/Index.jsx"));
const CrearProducto = lazy(() => import("./pages/Productos/Create.jsx"));
const EditarProducto = lazy(() => import("./pages/Productos/Edit.jsx"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={null}>
        <Login />
      </Suspense>
    ),
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Suspense fallback={null}>
              <Productos />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "productos/create",
        element: (
          <Suspense fallback={null}>
            <CrearProducto />
          </Suspense>
        ),
      },
      {
        path: "productos/edit/:id",
        element: (
          <Suspense fallback={null}>
            <EditarProducto />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
