import { useLocation } from "react-router-dom";
import { ProjectManagerLayout } from "../layout/ProjectManagerLayout";
import { AddProjectView, ProjectsView } from "../views";

const viewsMap = {
  "/projects": ProjectsView,
  "/projects/add": AddProjectView,
};

export const ProjectsListPage = () => {

  const location = useLocation();
  const ViewComponent = viewsMap[location.pathname] || ProjectsView; // Vista por defecto

  return (
    <ProjectManagerLayout>
        <ViewComponent/>
    </ProjectManagerLayout>
  )
}
