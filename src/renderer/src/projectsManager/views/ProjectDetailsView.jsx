import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Card, CardContent, Divider, Grid2, Typography } from "@mui/material";
import { GridActionsCellItem, GridDeleteIcon, GridRowEditStopReasons, GridRowModes } from "@mui/x-data-grid";
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataTable } from "../components";
import { ProjectManagerContext } from "../context/ProjectsManagerContext";

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

        const techniciansIds = relatedAssignments.map(assignment => assignment.technician);
    
        // Devolver la fase transformada
        return {
            ...phase,
            startDate: dayjs(phase.startDate).format('YYYY-MM-DD'),
            endDate: dayjs(phase.endDate).format('YYYY-MM-DD'),
            technicians: techniciansNames,
            techniciansIds: techniciansIds,
            assignmentHours: techniciansHours,
            hours_assigned: techniciansHours.reduce((accumulator, currentValue) => accumulator + currentValue, 0),
            isNew: false, 
        };
    });

    return transformedData;

}



// function EditToolbar(props) {
//     const { setRows, setRowModesModel } = props;
  
//     const handleClick = () => {
//       const id = randomId();
//       setRows((oldRows) => [
//         ...oldRows,
//         { id, name: '', age: '', role: '', isNew: true },
//       ]);
//       setRowModesModel((oldModel) => ({
//         ...oldModel,
//         [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
//       }));
//     };
  
//     return (
//       <GridToolbarContainer>
//         <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
//           Add record
//         </Button>
//       </GridToolbarContainer>
//     );
//   }


export const ProjectDetailsView = () => {

    const { "*": id } = useParams();
    const {projects, getProjectDetails, deleteAssignment, addAssignment} = useContext(ProjectManagerContext)
    const [project, setProject] = useState(null)
    const [details, setDetails] = useState([])
    const [expandedRows, setExpandedRows] = useState({});
    const [rowModesModel, setRowModesModel] = useState({});
    const [changes, setChanges] = useState([]);

    
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

    
    useEffect(() => {
        if (projects && id) {
            const projectFound = projects.find(proj => String(proj.id) === String(id)); // Busca el proyecto por ID
            setProject(projectFound);
            fetchDetails();
        }
    }, []); 



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

    const handleAddClick = async (rowId) => {
        
            const index = details.findIndex(item => item.id === rowId);

            if (index !== -1) {
                 
                const newAssignment = { 
                    technician: -1,
                    phase: details[index].id,
                    hours: 0,
                    startDate:details[index].startDate,
                    endDate:details[index].endDate,
                }

                await addAssignment(newAssignment)
                fetchDetails()
            }
        }

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => {
        console.log(id)
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => {
        console.log("SAVE")
 
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
        
    
    };

    const handleDeleteClick = (id) => {
        setDetails(details.filter((row) => row.id !== id));
      };

    const handleCancelClick = (id) => {
        console.log(id)
        console.log(details)
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    
        const editedRow = details.find((row) => row.id === id);
        console.log(editedRow)
        if (editedRow.isNew) {
          setDetails(details.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        console.log("PROCESS")
        console.log(newRow)
        let updatedRow

        if (!newRow.isMain){
            const parts =newRow.id.split("-");

            const indexPhase = parts[1]; 
            const indexTech = parts[2];
            console.log(indexPhase)
            const index = details.findIndex(item => String(item.id) === indexPhase);

            console.log(index)
            if (index === -1) return

            const newData = JSON.parse(JSON.stringify(details[index]))

            console.log(newData)
                
            if(newData.technicians[indexTech] === newRow.technicians ){
            
                newData.assignmentHours[indexTech] = Number(newRow.hours_assigned)

                const newChange = {
                    type:"assignment",
                    action:"edit",
                    prevData: details[index],
                    newData: newData,
                }

                console.log("newChange")

                console.log(newChange)

                setChanges([...changes, newChange])

            }else{

                newData.technicians[indexTech] = newRow.technicians
                newData.assignmentHours[indexTech] = Number(newRow.hours_assigned)
                
                const newChange = {
                    type:"assignment",
                    prevData: details[index],
                    newData: newData,
                }

                setChanges([...changes, newChange])

            }
            // await addAssignment(newAssignment)
            // fetchDetails()
                
        }else{

            const index = details.findIndex(item => item.id === newRow.id);
        
            if(index === -1) return

            const newData = JSON.parse(JSON.stringify(details[index]))

            newData.name = newRow.name
            newData.hours = Number(newRow.hours)
            newData.startDate = newRow.startDate
            newData.endDate = newRow.endDate

            const newChange = {
                type:"phase",
                action:"edit",
                prevData: details[index],
                newData: newData,
            }

            setChanges([...changes, newChange])
        }
        
        updatedRow = { ...newRow, isNew: false };
        setDetails(details.map((row) => (row.id === newRow.id ? updatedRow : row)));
         
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const isCellEditable = ({row, field}) => {
    
        if(row.isMain){
            switch(field){
                case "technicians": return false
                case "hours_assigned": return false

                default: return true
            }
        }else{
            switch(field){
                case "name": return false
                case "hours": return false

                default: return true
            }
        }
    }
    
    console.log(details)
    console.log(changes)

    // const handleDeleteClick =  async (row) => {

    //         console.log(row)
    //         const isMain = row.isMain

    //         if(isMain){
    //             console.log(row.id)
    //             console.log(details)
    //             const index = details.findIndex(item => item.id === row.id);
    //             console.log(index)
    //             if(index >= 0){
    //                 const newDetails = details.filter(item => item.id !== row.id);
    //                 setDetails(newDetails)
    //             }

    //         }else{
    //             const parts = row.id.split("-");

    //             const indexPhase = parts[1]; 
    //             const indexTech = parts[2]; 
       
    //             const index = details.findIndex(item => String(item.id) === indexPhase);


    //             if(index>=0){
    //                 console.log(details[index])
    //                 await deleteAssignment(indexPhase, details[index].techniciansIds[indexTech])
    //                 fetchDetails()
    //             }
            
    //         }
    //     }

    const columns =/*useMemo(() =>*/ [
        { field: 'name', headerName: 'Nombre', width: 300, editable:true},
        {   editable: true,
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
        { field: 'hours_assigned', headerName: 'Horas Asignadas', width: 100, editable:true},
        { field: 'hours', headerName: 'Horas', width: 100,  editable:true },
        { field: 'startDate', headerName: 'Fecha Inicio', width: 120, editable:true,
            renderEditCell: (params) => (
                    <DatePicker
                        value={params.value ? dayjs(params.value) : null}
                        slotProps={{ textField: { size: 'small' } }}
                    />
            ),    

        },
        { field: 'endDate', headerName: 'Fecha Fin', width: 120, editable:true,
            renderEditCell: (params) => (
                <DatePicker
                    value={params.value ? dayjs(params.value) : null}
                    slotProps={{ textField: { size: 'small' } }}
                />
        ),  
        },
        {
            field: 'actions',
            type: 'actions',
            width: 120,
            getActions: (params) => {
                const isInEditMode = rowModesModel[params.row.id]?.mode === GridRowModes.Edit;
                if(!isInEditMode){
                    const actions = [
                        <GridActionsCellItem
                          key="edit"
                          icon={<EditIcon />}
                          label="Editar"
                          onClick={() => handleEditClick(params.row.id)}
                        />,
                        <GridActionsCellItem
                          key="delete"
                          icon={<GridDeleteIcon />}
                          label="Borrar"
                          onClick={() => {handleDeleteClick(params.row.id)}}
                        />,
                      ];
                  
                      // Añadir el botón "Añadir" solo si `isMain` es true
                      if (params.row.isMain) {
                        actions.unshift(
                          <GridActionsCellItem
                            key="add"
                            icon={<AddIcon />}
                            label="Añadir"
                            onClick={() => handleAddClick(params.row.id)}
                          />
                        );
                      }
                  
                      return actions;
                } else{

                    const actions = [
                        <GridActionsCellItem
                          key="save"
                          icon={<SaveIcon />}
                          label="Guardar"
                          onClick={() => {handleSaveClick(params.row.id)}}
                        />,
                        <GridActionsCellItem
                          key="cancel"
                          icon={<CancelIcon />}
                          label="Cancelar"
                          onClick={() => {handleCancelClick(params.row.id)}}
                        />,
                      ];
                  
                      return actions;

                }

              
            },
        },
    
    ]

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
                        <DataTable initialRows={processedRows}  columns={columns} getRowClassNameFunction={(params) => params.row.isMain ? "main-row" : "secondary-row"}
                            rowModesModel={rowModesModel}
                            handleRowEditStop={handleRowEditStop}
                            handleRowModesModelChange={handleRowModesModelChange}
                            processRowUpdate={processRowUpdate}
                            isCellEditable={isCellEditable}
                            />
                    </Box>
                </Card>
            </Box>

        </Grid2>
        ) 
    )
}
