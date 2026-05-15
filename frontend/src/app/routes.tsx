import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Produccion } from "./pages/Produccion";
import { Empleados } from "./pages/Empleados";
import { Aseo } from "./pages/Aseo";
import { Rendimiento } from "./pages/Rendimiento";
import { Login } from "./pages/Login";

const ProtectedRoute = ({ Component }: { Component: React.FC }) => {
  const token = localStorage.getItem('authToken');
  return token ? <Component /> : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: () => <ProtectedRoute Component={Home} /> },
      { path: "produccion", Component: () => <ProtectedRoute Component={Produccion} /> },
      { path: "empleados", Component: () => <ProtectedRoute Component={Empleados} /> },
      { path: "aseo", Component: () => <ProtectedRoute Component={Aseo} /> },
      { path: "rendimiento", Component: () => <ProtectedRoute Component={Rendimiento} /> },
    ],
  },
]);
