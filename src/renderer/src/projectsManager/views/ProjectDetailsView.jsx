import { useContext, useEffect, useState } from "react"
import { ProjectManagerContext } from "../context/ProjectsManagerContext"
import { useParams } from "react-router-dom"
import { Box, Card, CardContent, Divider, Grid2, Typography } from "@mui/material";
import { DataTable } from "../components";
import { Details } from "@mui/icons-material";


const columns =[
    { field: 'name', headerName: 'Nombre', width: 200 },
    { field: 'technicians', headerName: 'Técnicos', width: 300},
    { field: 'hours', headerName: 'Horas', width: 100 },
    { field: 'hours_assigned', headerName: 'Horas Asignadas', width: 100 },
    { field: 'startDate', headerName: 'Fecha Inicio', width: 100},
    { field: 'endDate', headerName: 'Fecha Fin', width: 100 },
    { field: "status", headerName:"Estado", width: 200, type: "singleSelect", valueOptions: ["Adjudicación pendiente", "En desarrollo", "Finalizado", ""], editable: false },
]


const formatData = (data) => {
    console.log("Format")

    const transformedData = data.phases.map(phase => {
        // Filtrar las asignaciones asociadas a la fase actual
        const relatedAssignments = data.assignments.filter(assignment => assignment.phase === phase.id);
        
        // Obtener los nombres de los técnicos asociados a estas asignaciones
        const techniciansNames = relatedAssignments.map(assignment => {
            const technician = data.technicians.find(tech => tech.id === assignment.technician);
            return technician ? technician.name : null;
        }).filter(name => name !== null);
    
        // Obtener las horas de las asignaciones
        const techniciansHours = relatedAssignments.map(assignment => assignment.hours);
    
        // Devolver la fase transformada
        return {
            ...phase,
            technicians: techniciansNames,
            assignmentHours: techniciansHours,
        };
    });

    return transformedData;

}



export const ProjectDetailsView = () => {

    const { "*": id } = useParams();
    const {projects, getProjectDetails} = useContext(ProjectManagerContext)
    const [project, setProject] = useState(null)
    const [details, setDetails] = useState([])

    
    const fetchDetails = async () => {
        const data = await getProjectDetails(id)
        console.log(data)
        const formattedData = formatData(data)
        setDetails(formattedData)


        // setDetails({
        // phases: data.phases,
        // assignments: data.assignments,
        // technicians: data.technicians,
        // })
    }

    useEffect(() => {
        if (projects && id) {
            const projectFound = projects.find(proj => String(proj.id) === String(id)); // Busca el proyecto por ID
            setProject(projectFound);
            fetchDetails();
        }
    }, [projects, id]); 



    console.log(details)
    return (
        project && (
        <Grid2
            container
            spacing={2}  // Ajuste del espaciado
            display="flex"
            alignItems="flex-start"  // Alineación a la izquierda del contenido
            sx={{pt: 2, pr:4,}}
            width={"100%"}
        >
            <Typography variant="h2" fontSize={30} fontWeight={500} sx={{width:"100%", alignSelf: "flex-start" }}>
                {project && project.name}
            </Typography>

            <Typography variant="h4" fontSize={20} sx={{width:"100%", mb: 1 }}>
                Información del Proyecto
            </Typography>

                
            <Box sx={{ width:"100%", mt: 1, p: 3 }}>

                {/* Información del Proyecto */}
                <Grid2 container spacing={2} sx={{display:"flex", flexDirection:"row"}}>
                    <Grid2 width="40%">
                        <Card>
                            <CardContent>
                            <Typography variant="p"><strong>Duración:</strong> {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</Typography>
    
                            </CardContent>
                        </Card>
                    </Grid2>

                    <Grid2 width="40%">
                        <Card>
                            <CardContent>
                            <Typography variant="p"><strong>Presupuesto:</strong> {project.remaining_budget}€ / {project.budget}€</Typography>
                            </CardContent>
                        </Card>
                    </Grid2>
                    

                </Grid2>

            </Box>

            {details && <DataTable initialRows={details}  columns={columns}/>}

      

                {/* Diagrama de Gantt
                <Divider sx={{ my: 4 }} />
                <Typography variant="h6">Diagrama de Gantt</Typography>
                <Box sx={{ mt: 2 }}>
                    <GanttChart
                    data={proyecto.ganttData} // La data debe tener la estructura adecuada para el diagrama
                    columns={[
                        { name: 'task', label: 'Tarea' },
                        { name: 'start', label: 'Inicio' },
                        { name: 'end', label: 'Fin' },
                    ]}
                    />
                </Box> */}
            

        </Grid2>
        ) 
    )
}
