import { useState } from "react";
import { ProjectManagerLayout } from "../layout/ProjectManagerLayout";
import { AddProjectView, ProjectsView } from "../views";



export const ProjectsListPage = () => {

  const [currentView, setCurrentView] = useState("projects")

  const changeCurrentView = (viewName) => {
    setCurrentView(viewName)
  }


  return (
    <ProjectManagerLayout>
        {currentView === "projects" && <ProjectsView changeView={changeCurrentView}/>}
        {currentView === "addProjects" && <AddProjectView changeView={changeCurrentView} />}

    </ProjectManagerLayout>
  )
}
