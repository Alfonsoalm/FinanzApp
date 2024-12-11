import { Box, Button, Card, CardContent, Divider, Grid2, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { DataTable } from "../components";
import { ProjectManagerContext } from "../context/ProjectsManagerContext";
import { GridActionsCellItem, GridDeleteIcon } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const formatData = (data) => {

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
    const {projects, getProjectDetails, deleteAssignment} = useContext(ProjectManagerContext)
    const [project, setProject] = useState(null)
    const [details, setDetails] = useState([])
    const [expandedRows, setExpandedRows] = useState({});

    
    const fetchDetails = async () => {
        const data = await getProjectDetails(id)
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

    const processedRows = details.flatMap((row) => {
        const mainRow = { ...row, isMain: true }; // Identifica fila principal
        const isExpanded = expandedRows[row.id];
        // Si está expandido, genera filas secundarias para técnicos
        const technicianRows = isExpanded
            ? row.technicians.map((tech, index) => ({
                id: `tech-${row.id}-${index}`,
                technicians: tech,
                // hours: "--",
                hours_assigned: row.assignmentHours[index],
                // startDate: "--",
                // endDate: "--",
                isMain: false, // Identifica fila secundaria
            }))
            : [];

        return [mainRow, ...technicianRows];
    });
    
    // Manejador para expandir/colapsar filas
    const toggleRow = (id) => {
        setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleAddTechnician = useCallback(
        (rowId) => {
        
            const index = details.findIndex(item => item.id === rowId);

            if (index !== -1) {
                const newDetails = [... details]
        
                newDetails[index].technicians.push("Nuevo técnico")
                newDetails[index].assignmentHours.push(0)
                setDetails(newDetails)
            }
        }
      ,[details]
    )

    const handleEditRow = useCallback(
        (row) => {

           return
        }
      ,[]
    )

    const handleDeleteRow = (row) => {

            console.log(row)
            const isMain = row.isMain

            if(isMain){
                console.log(row.id)
                console.log(details)
                const index = details.findIndex(item => item.id === row.id);
                console.log(index)
                if(index >= 0){
                    const newDetails = details.filter(item => item.id !== row.id);
                    setDetails(newDetails)
                }

            }else{
                const parts = row.id.split("-");

                const indexPhase = parts[1]; 
                const indexTech = parts[2]; 
       
                const index = details.findIndex(item => String(item.id) === indexPhase);


                if(index>=0){
                    deleteAssignment(indexPhase, details[index].technicians[indexTech])
                }
            
            }
        }

    const columns =useMemo(() => [
        { field: 'name', headerName: 'Nombre', width: 300 },
        {   editable: false,
            field: 'technicians', 
            headerName: 'Técnicos', 
            width: 200, 
            renderCell: (params) => {
                const isMain = params.row.isMain;
                return isMain ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button
                      size="small"
                      onClick={() => toggleRow(params.row.id)}
                    >
                      {expandedRows[params.row.id] ? "▼" : "►"}
                    </Button>
                    {params.value.join(", ")}
                  </Box>
                ) : (
                  params.value
                );
            },
        },
        { field: 'hours_assigned', headerName: 'Horas Asignadas', width: 100 },
        { field: 'hours', headerName: 'Horas', width: 100 },
        { field: 'startDate', headerName: 'Fecha Inicio', width: 100},
        { field: 'endDate', headerName: 'Fecha Fin', width: 100 },
        {
            field: 'actions',
            type: 'actions',
            width: 120,
            getActions: (params) => {
                const actions = [
                  <GridActionsCellItem
                    key="edit"
                    icon={<EditIcon />}
                    label="Editar"
                    onClick={() => {handleEditRow(params.row)}}
                  />,
                  <GridActionsCellItem
                    key="delete"
                    icon={<GridDeleteIcon />}
                    label="Borrar"
                    onClick={() => {handleDeleteRow(params.row)}}
                  />,
                ];
            
                // Añadir el botón "Añadir" solo si `isMain` es true
                if (params.row.isMain) {
                  actions.unshift(
                    <GridActionsCellItem
                      key="add"
                      icon={<AddIcon />}
                      label="Añadir"
                      onClick={() => handleAddTechnician(params.row.id)}
                    />
                  );
                }
            
                return actions;
            },
        },
    
    ],[expandedRows])

    console.log(details)
    return (
        project && (
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
                        <DataTable initialRows={processedRows}  columns={columns} getRowClassNameFunction={(params) => params.row.isMain ? "main-row" : "secondary-row"}/>
                    </Box>
                </Card>
            </Box>

        </Grid2>
        ) 
    )
}
