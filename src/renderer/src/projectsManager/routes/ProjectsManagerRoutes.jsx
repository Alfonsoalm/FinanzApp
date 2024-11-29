import { useEffect } from "react"
import { Navigate, Route, Routes } from "react-router-dom";
import { ProjectsListPage, TechniciansPage } from "../pages";
import { ProjectManagerProvider } from "../context/ProjectsManagerContext";


export const ProjectsManagerRoutes = () => {

  useEffect(() => {
    window.api.maximizeWindow()
  }, [])


  return (
    <ProjectManagerProvider>
      <Routes>
          <Route path="projects/*" element={<ProjectsListPage />} />
          <Route path="technicians/*" element={<TechniciansPage />} />

          <Route path="/" element={<Navigate to={"/projects"} />} />
      </Routes>
    </ProjectManagerProvider>
   
  );
}
