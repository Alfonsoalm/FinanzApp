import { ProjectManagerLayout } from "../layout/ProjectManagerLayout"
import { matchPath, useLocation } from "react-router-dom";
import { TechniciansView, AddTechnicianView, TechnicianDetailsView } from "../views";

const viewsMap = [
  { path: "/technicians", component: TechniciansView },
  { path: "/technicians/add", component: AddTechnicianView},
  { path: "/technicians/:id", component: TechnicianDetailsView},
];

export const TechniciansPage = () => {

  const location = useLocation();

  // Encuentra la ruta que coincide con el `location.pathname`
  const matchedRoute = viewsMap.find(({ path }) =>
    matchPath({ path, end: true }, location.pathname)
  );

  // Si no hay coincidencia, muestra la vista por defecto (ProjectsView)
  const ViewComponent = matchedRoute ? matchedRoute.component : TechniciansView;

  return (
    <ProjectManagerLayout>
        <ViewComponent/>
    </ProjectManagerLayout>
  )
}
