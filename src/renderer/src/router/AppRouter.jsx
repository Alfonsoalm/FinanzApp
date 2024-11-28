import { Route, Routes } from "react-router-dom"
import { LoginPage } from "../auth"
import { ProjectsManagerRoutes } from "../projectsManager/routes/ProjectsManagerRoutes"

export const AppRouter = () => {
    return (
        <>
            <Routes>
       
                <Route path="/login" element={<LoginPage />} />
                <Route path="/*" element={<ProjectsManagerRoutes />} />
        
            </Routes>
        </>
      )
}
