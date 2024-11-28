import { useState } from "react";
import { useWindowApi } from "../../hooks";
import { ProjectManagerLayout } from "../layout/ProjectManagerLayout";
import { AddProjectView, ProjectsView } from "../views";


const fetchProjectData = async () => {
  return await window.api.getProjects()
}

const apiMethods = [fetchProjectData]

export const ProjectsPage = () => {

  const {data, isLoading} = useWindowApi({apiMethods:apiMethods})
  const projects = isLoading ? [] : data[0].data ;
  const [currentView, setCurrentView] = useState("projects")

  const changeCurrentView = (viewName) => {
    setCurrentView(viewName)
  }


  return (
    <ProjectManagerLayout>
        {currentView === "projects" && <ProjectsView projects={projects} changeView={changeCurrentView}/>}
        {currentView === "addProjects" && <AddProjectView changeView={changeCurrentView} />}

    </ProjectManagerLayout>
  )
}
