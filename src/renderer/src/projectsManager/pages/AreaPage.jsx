import { matchPath, useLocation } from "react-router-dom";
import { ProjectManagerLayout } from "../layout/ProjectManagerLayout";
import { AreaView } from "../views/AreaView";

const viewsMap = [
  { path: "/area", component: AreaView },
];

export const AreaPage = () => {
  const location = useLocation();
  // Encuentra la ruta que coincide con el `location.pathname`
  const matchedRoute = viewsMap.find(({ path }) =>
    matchPath({ path, end: true }, location.pathname)
  );

  // Si no hay coincidencia, muestra la vista por defecto (ProjectsView)
  const ViewComponent = matchedRoute ? matchedRoute.component : AreaView;

  return (
    <ProjectManagerLayout>
        <ViewComponent/>
    </ProjectManagerLayout>
  )
}
