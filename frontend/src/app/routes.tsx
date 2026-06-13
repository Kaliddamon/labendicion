import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { Produccion } from "./pages/Produccion";
import { Empleados } from "./pages/Empleados";
import { Aseo } from "./pages/Aseo";
import { Rendimiento } from "./pages/Rendimiento";
import { Login } from "./pages/Login";
import { GestionarRoles } from "./components/GestionarRoles";
import { Configuracion } from "./pages/Configuracion";
import { ContactoFormulario } from "./pages/ContactoFormulario";
import { MensajesContacto } from "./pages/MensajesContacto";
import { Finanzas } from "./pages/Finanzas";

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  {
    path: "/",
    Component: Layout,
    children: [
      { 
        index: true, 
        Component: () => {
          // If no roles, show Contact form, otherwise Home
          return <ProtectedRoute allowNoRole><HomeOrContact /></ProtectedRoute>;
        } 
      },
      { path: "produccion", Component: () => <ProtectedRoute requiredRoles={['SUPERADMINISTRADOR', 'ADMINISTRADOR']}><Produccion /></ProtectedRoute> },
      { path: "empleados", Component: () => <ProtectedRoute requiredRoles={['SUPERADMINISTRADOR', 'ADMINISTRADOR']}><Empleados /></ProtectedRoute> },
      { path: "aseo", Component: () => <ProtectedRoute requiredRoles={['SUPERADMINISTRADOR', 'ADMINISTRADOR', 'TRABAJADOR']}><Aseo /></ProtectedRoute> },
      { path: "rendimiento", Component: () => <ProtectedRoute requiredRoles={['SUPERADMINISTRADOR', 'ADMINISTRADOR', 'TRABAJADOR']}><Rendimiento /></ProtectedRoute> },
      { path: "configuracion", Component: () => <ProtectedRoute requiredRoles={['SUPERADMINISTRADOR', 'ADMINISTRADOR']}><Configuracion /></ProtectedRoute> },
      { path: "mensajes", Component: () => <ProtectedRoute requiredRoles={['SUPERADMINISTRADOR', 'ADMINISTRADOR']}><MensajesContacto /></ProtectedRoute> },
      { path: "finanzas", Component: () => <ProtectedRoute requiredRoles={['SUPERADMINISTRADOR', 'ADMINISTRADOR']}><Finanzas /></ProtectedRoute> },
    ],
  },
]);

function HomeOrContact() {
  const { roles } = useAuth();
  if (!roles || roles.length === 0) {
    return <ContactoFormulario />;
  }
  return <Home />;
}
