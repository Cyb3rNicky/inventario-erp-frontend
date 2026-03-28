import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";

const Login = lazy(() => import("./pages/Login.jsx"));

const Productos = lazy(() => import("./pages/Productos/Index.jsx"));
const CrearProducto = lazy(() => import("./pages/Productos/Create.jsx"));
const EditarProducto = lazy(() => import("./pages/Productos/Edit.jsx"));

const Proveedores = lazy(() => import("./pages/Proveedores/Index.jsx"));
const CrearProveedor = lazy(() => import("./pages/Proveedores/Create.jsx"));
const EditarProveedor = lazy(() => import("./pages/Proveedores/Edit.jsx"));

const PedidosClientes = lazy(() => import("./pages/PedidosClientes/Index.jsx"));
const EditarPedidoCliente = lazy(
  () => import("./pages/PedidosClientes/Edit.jsx"),
);

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
          <Suspense fallback={null}>
            <Productos />
          </Suspense>
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
      {
        path: "proveedores",
        element: (
          <Suspense fallback={null}>
            <Proveedores />
          </Suspense>
        ),
      },
      {
        path: "proveedores/create",
        element: (
          <Suspense fallback={null}>
            <CrearProveedor />
          </Suspense>
        ),
      },
      {
        path: "proveedores/edit/:id",
        element: (
          <Suspense fallback={null}>
            <EditarProveedor />
          </Suspense>
        ),
      },
      {
        path: "pedidos-clientes",
        element: (
          <Suspense fallback={null}>
            <PedidosClientes />
          </Suspense>
        ),
      },
      {
        path: "pedidos-clientes/edit/:id",
        element: (
          <Suspense fallback={null}>
            <EditarPedidoCliente />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
