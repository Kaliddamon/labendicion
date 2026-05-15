import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { Produccion } from "./pages/Produccion";
import { Empleados } from "./pages/Empleados";
import { Aseo } from "./pages/Aseo";
import { Rendimiento } from "./pages/Rendimiento";
import { Login } from "./pages/Login";
import { GestionarRoles } from "./components/GestionarRoles";

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: () => <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "produccion", Component: () => <ProtectedRoute requiredRoles={['SUPERADMINISTRADOR', 'ADMINISTRADOR']}><Produccion /></ProtectedRoute> },
      { path: "empleados", Component: () => <ProtectedRoute requiredRoles={['SUPERADMINISTRADOR', 'ADMINISTRADOR']}><Empleados /></ProtectedRoute> },
      { path: "aseo", Component: () => <ProtectedRoute requiredRoles={['SUPERADMINISTRADOR', 'ADMINISTRADOR', 'TRABAJADOR']}><Aseo /></ProtectedRoute> },
      { path: "rendimiento", Component: () => <ProtectedRoute requiredRoles={['SUPERADMINISTRADOR', 'ADMINISTRADOR', 'TRABAJADOR']}><Rendimiento /></ProtectedRoute> },
      { path: "roles", Component: () => <ProtectedRoute requiredRoles={['SUPERADMINISTRADOR', 'ADMINISTRADOR']}><GestionarRoles /></ProtectedRoute> },
    ],
  },
]);


