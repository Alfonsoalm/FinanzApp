import { Box, Card, CardContent, Divider, Grid2, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProjectManagerContext } from "../../context/ProjectsManagerContext";
import { PhasesTable } from '../components/PhasesTable';
import { formatDetailsProjects } from '../helpers/formatDetailsProjects';


export const ProjectDetailsPage = () => {

    //ID proyecto actual
    const { "*": id } = useParams();
    //Proyecto Actual
    const [project, setProject] = useState(null)
    //Detalles del proyecto actual (Fases, técnicos y asignaciones)
    const [details, setDetails] = useState([])
    

    const [changes, setChanges] = useState([]);
    const {projects, getProjectDetails} = useContext(ProjectManagerContext)
    
    const fetchDetails = async () => {
        const data = await getProjectDetails(id)
        const formattedData = formatDetailsProjects(data)
        setDetails(formattedData)
    }

    useEffect(() => {
        if (projects && id) {
            const projectFound = projects.find(proj => String(proj.id) === String(id)); // Busca el proyecto por ID
            setProject(projectFound);
            fetchDetails();
        }
    }, [projects, id]); 

    return (
        project && id && (
        <Grid2
            container
            spacing={1}  // Ajuste del espaciado
            display="flex"
            alignItems="flex-start"  // Alineación a la izquierda del contenido
            sx={{pt: 4, pl:4, pr:4, overflowY: "auto", height:"120%"}}
            width={"100%"}
            overflow
        >
            <Typography variant="h2" fontSize={30} fontWeight={500} sx={{width:"100%", alignSelf: "flex-start" }}>
                {project && project.name}
            </Typography>

            <Box sx={{ width:"95%", mt: 1 }}>

                <Card sx={{border: "1px solid green"}}>
                    <CardContent>
                        <Typography variant="h3" fontSize={20} sx={{width:"100%", mb: 1 }}><strong>Información del Proyecto</strong></Typography>
                        <Divider/>
                        <Box sx={{ width:"100%", gap:2, mt:2, display:"flex", flexDirection:"row" }}>
                            <Typography variant="p" ><strong>Duración:</strong> {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</Typography>
                            <Typography variant="p" ><strong>Presupuesto:</strong> {project.remaining_budget}€ / {project.budget}€</Typography>
                            <Typography variant="p" ><strong>Estado: </strong>{project.status}</Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
            <Box sx={{ width: "95%", p:0}}>
                <Card sx={{p:2,  border: "1px solid green" }}>
                    <Typography variant="h3" fontSize={20} margin={1}><strong>Paquetes de Trabajo</strong></Typography>
                    <Box  display="flex" justifyContent="center" sx={{ width: "100%", overflowY: true,  p:0, backgroundColor:"background.default"}} alignItems="center">
                        <PhasesTable id_project={id} data={details} setData={setDetails} changes={changes} setChanges={setChanges} fetchData={fetchDetails}/>
                    </Box>
                </Card>
            </Box>

        </Grid2>
        ) 
    )
}
