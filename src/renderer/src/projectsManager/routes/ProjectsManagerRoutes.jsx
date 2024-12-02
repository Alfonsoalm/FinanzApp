import { useEffect } from "react"
import { Navigate, Route, Routes } from "react-router-dom";
import { ProjectsPage, TechniciansPage } from "../pages";
import { ProjectManagerProvider } from "../context/ProjectsManagerContext";


export const ProjectsManagerRoutes = () => {

  useEffect(() => {
    window.api.maximizeWindow()
  }, [])


  return (
    <ProjectManagerProvider>
      <Routes>
          <Route path="projects/*" element={<ProjectsPage />} />
          <Route path="technicians/*" element={<TechniciansPage />} />

          <Route path="/" element={<Navigate to={"/projects"} />} />
      </Routes>
    </ProjectManagerProvider>
   
  );
}