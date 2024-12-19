import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProjectManagerProvider } from "../context/ProjectsManagerContext";
import { AreaPage, TechniciansPage } from "../pages";
import { ProjectsRoutes } from "../projects/routes/ProjectsRoutes";
import { InformPage } from "../pages/InformPage";

export const ProjectsManagerRoutes = () => {

  useEffect(() => {
    window.api.maximizeWindow()
  }, [])

  return (
    <ProjectManagerProvider>
      <Routes>
          <Route path="projects/*" element={<ProjectsRoutes />} />
          <Route path="technicians/*" element={<TechniciansPage />} />
          <Route path="area/*" element={<AreaPage />} />
          <Route path="inform/*" element={<InformPage />} />
          <Route path="/" element={<Navigate to={"/projects"} />} />
      </Routes>
    </ProjectManagerProvider>
   
  );
}
