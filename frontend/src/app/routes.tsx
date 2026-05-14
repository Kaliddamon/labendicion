import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Produccion } from "./pages/Produccion";
import { Empleados } from "./pages/Empleados";
import { Aseo } from "./pages/Aseo";
import { Rendimiento } from "./pages/Rendimiento";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "produccion", Component: Produccion },
      { path: "empleados", Component: Empleados },
      { path: "aseo", Component: Aseo },
      { path: "rendimiento", Component: Rendimiento },
    ],
  },
]);
