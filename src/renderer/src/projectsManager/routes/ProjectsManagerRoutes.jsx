import { useEffect } from "react"
import { Navigate, Route, Routes } from "react-router-dom";
import { ProjectsPage, TechniciansPage } from "../pages";


export const ProjectsManagerRoutes = () => {

  useEffect(() => {
    window.api.maximizeWindow()
  }, [])


  return (
  
      <Routes>
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="technicians" element={<TechniciansPage />} />

          <Route path="/" element={<Navigate to={"/projects"} />} />
      </Routes>
      
   
  );
}
