import { Navigate, Route, Routes } from "react-router-dom"
import { ProjectsListPage } from "../pages/ProjectsListPage"
import { AddProjectPage } from "../pages/AddProjectpage"
import { ProjectDetailsPage } from "../pages/ProjectDetailsPage"
import { ProjectManagerLayout } from "../../layout/ProjectManagerLayout"


export const ProjectsRoutes = () => {
  return (
    <ProjectManagerLayout>
      <Routes>

          <Route path="/" element={<ProjectsListPage />} />
          <Route path="add/" element={<AddProjectPage />} />
          <Route path=":id/" element={<ProjectDetailsPage />} />

          <Route path="/*" element={<Navigate to={"/"} />} />


      </Routes>
    </ProjectManagerLayout>
  )
}
