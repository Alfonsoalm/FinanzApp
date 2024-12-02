import { matchPath, useLocation } from "react-router-dom";
import { ProjectManagerLayout } from "../layout/ProjectManagerLayout";
import { AddProjectView, ProjectDetailsView, ProjectsView } from "../views";


const viewsMap = [
  { path: "/projects", component: ProjectsView },
  { path: "/projects/add", component: AddProjectView },
  { path: "/projects/:id", component: ProjectDetailsView },
];

export const ProjectsPage = () => {

  const location = useLocation();

  // Encuentra la ruta que coincide con el `location.pathname`
  const matchedRoute = viewsMap.find(({ path }) =>
    matchPath({ path, end: true }, location.pathname)
  );

  // Si no hay coincidencia, muestra la vista por defecto (ProjectsView)
  const ViewComponent = matchedRoute ? matchedRoute.component : ProjectsView;

  return (
    <ProjectManagerLayout>
        <ViewComponent/>
    </ProjectManagerLayout>
  )
}
