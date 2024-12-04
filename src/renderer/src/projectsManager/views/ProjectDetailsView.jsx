import { Box, Card, CardContent, Grid2, Typography } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { DataTable } from "../components";
import { ProjectManagerContext } from "../context/ProjectsManagerContext";
import { GridActionsCellItem, GridDeleteIcon } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';

const formatData = (data) => {
    console.log("Format")

    const transformedData = data.phases.map(phase => {
        // Filtrar las asignaciones asociadas a la fase actual
        const relatedAssignments = data.assignments.filter(assignment => assignment.phase === phase.id);
        
        // Obtener los nombres de los técnicos asociados a estas asignaciones
        const techniciansNames = relatedAssignments.map(assignment => {
            const technician = data.technicians.find(tech => tech.id === assignment.technician);
            return technician ? " "+technician.name : null;
        }).filter(name => name !== null);
    
        // Obtener las horas de las asignaciones
        const techniciansHours = relatedAssignments.map(assignment => assignment.hours);
    
        // Devolver la fase transformada
        return {
            ...phase,
            technicians: techniciansNames,
            assignmentHours: techniciansHours,
            hours_assigned: techniciansHours.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
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
    }

    useEffect(() => {
        if (projects && id) {
            const projectFound = projects.find(proj => String(proj.id) === String(id)); // Busca el proyecto por ID
            setProject(projectFound);
            fetchDetails();
        }
    }, [projects, id]); 

    const columns =useMemo(() => [
        { field: 'name', headerName: 'Nombre', width: 300 },
        { field: 'technicians', headerName: 'Técnicos', width: 300},
        { field: 'hours', headerName: 'Horas', width: 100 },
        { field: 'hours_assigned', headerName: 'Horas Asignadas', width: 100 },
        { field: 'startDate', headerName: 'Fecha Inicio', width: 100},
        { field: 'endDate', headerName: 'Fecha Fin', width: 100 },
        {
            field: 'actions',
            type: 'actions',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                key={"edit"}
                icon={<EditIcon />}
                label="Editar"
                onClick={() => {}}
                />,
                <GridActionsCellItem
                key={"delete"}
                icon={<GridDeleteIcon />}
                label="Borrar"
                onClick={() => {}}
                />,
            ],
        },
    
    ],[])

    return (
        project && (
        <Grid2
            container
            spacing={1}  // Ajuste del espaciado
            display="flex"
            alignItems="flex-start"  // Alineación a la izquierda del contenido
            sx={{pt: 2, pr:4, overflowY: "auto", height:"120%"}}
            width={"100%"}
            overflow
        >
            <Typography variant="h2" fontSize={30} fontWeight={500} sx={{width:"100%", alignSelf: "flex-start" }}>
                {project && project.name}
            </Typography>

            <Typography variant="h4" fontSize={20} sx={{width:"100%", mb: 1 }}>
                Información del Proyecto
            </Typography>

                
            <Box sx={{ width:"100%", mt: 1 }}>

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
        <Box>
            <Grid2 container variant="div" display="flex" justifyContent="center" sx={{ width: "100%", pl: 0 , pr:4}} alignItems="center">
                <DataTable initialRows={details}  columns={columns}/>
            </Grid2>
        </Box>

        </Grid2>
        ) 
    )
}
