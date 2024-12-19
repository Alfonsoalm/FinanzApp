import { matchPath, useLocation } from "react-router-dom";
import { ProjectManagerLayout } from "../layout/ProjectManagerLayout";
import { InformView } from "../views/InformView";

const viewsMap = [
  { path: "/area", component: InformView },
];

export const InformPage = () => {
  const location = useLocation();
  // Encuentra la ruta que coincide con el `location.pathname`
  const matchedRoute = viewsMap.find(({ path }) =>
    matchPath({ path, end: true }, location.pathname)
  );

  // Si no hay coincidencia, muestra la vista por defecto (ProjectsView)
  const ViewComponent = matchedRoute ? matchedRoute.component : InformView;

  return (
    <ProjectManagerLayout>
        <ViewComponent/>
    </ProjectManagerLayout>
  )
}
