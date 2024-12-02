import { useContext, useEffect, useState } from "react"
import { ProjectManagerContext } from "../context/ProjectsManagerContext"
import { useParams } from "react-router-dom"


export const ProjectDetailsView = () => {

    const { "*": id } = useParams();
    console.log(id)
    const {projects} = useContext(ProjectManagerContext)
    const [project, setProject] = useState(null)

    useEffect(() => {
      setProject(projects.find(proj => {proj.id === id 
         return proj}))
    }, [])
    
    console.log(project)

    return (
        <h1>{project && project.name}</h1>
    )
}
