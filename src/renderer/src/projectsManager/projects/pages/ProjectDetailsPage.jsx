import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Card, CardContent, Divider, FormControl, Grid2, MenuItem, Select, Typography } from "@mui/material";
import { GridActionsCellItem, GridDeleteIcon, GridRowEditStopReasons, GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataTable } from "../../components";
import { ProjectManagerContext } from "../../context/ProjectsManagerContext";
import { EditToolbar } from '../components/EditToolbar';
import { formatDetailsProjects } from '../helpers/formatDetailsProjects';


export const ProjectDetailsPage = () => {

    const { "*": id } = useParams();
    const {projects, technicians, getProjectDetails, deleteAssignment, addAssignment} = useContext(ProjectManagerContext)
    const [project, setProject] = useState(null)
    const [details, setDetails] = useState([])
    const [expandedRows, setExpandedRows] = useState({});
    const [rowModesModel, setRowModesModel] = useState({});
    const [changes, setChanges] = useState([]);
    
    useEffect(() => {
        if (projects && id) {
            const projectFound = projects.find(proj => String(proj.id) === String(id)); // Busca el proyecto por ID
            setProject(projectFound);
            fetchDetails();
        }
    }, []); 

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

    



    const processedRows = details.flatMap((row) => {
        const mainRow = { ...row, isMain: true }; // Identifica fila principal
        const isExpanded = expandedRows[row.id];
        // Si está expandido, genera filas secundarias para técnicos

        const technicianRows = isExpanded
            ? row.technicians.map((tech, index) => ({
                id: `tech-${row.id}-${index}`,
                index: row.id,
                technician_id: technicians.filter(technician => technician.name === tech)[0].id,
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
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (deletedRow) => {

        if (!deletedRow.isMain){

            const index = details.findIndex(item => item.id === deletedRow.index);

            if (index === -1) return

            const newData = JSON.parse(JSON.stringify(details[index]))

                
            if(deletedRow.technician_id >= newData.technicians.length ) return
            
            newData.technicians.splice(deletedRow.technician_id, 1);
            newData.techniciansIds.splice(deletedRow.technician_id, 1);
            newData.assignmentHours.splice(deletedRow.technician_id, 1);

            const newChange = {
                type:"assignment",
                action:"delete",
                prevData: details[index],
                newData: newData,
            }

            setChanges([...changes, newChange])

            setDetails(details.map((row) => (row.id === deletedRow.index ? newData : row)));

            
        
        }else{

            const deteledDetails = details.filter((row) => row.id === deletedRow.index)
            setDetails(details.filter((row) => row.id !== deletedRow.index));
    
            const newChange = {
                type:"phase",
                action:"delete",
                prevData: deteledDetails,
                newData: {},
            }
    
            setChanges([...changes, newChange])

        }
      };

    const handleCancelClick = (cancelRow) => {
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    
        const editedRow = details.find((row) => row.id === cancelRow.index);
        if (editedRow.isNew) {
          setDetails(details.filter((row) => row.id !== cancelRow.index));
        }
    };

    const processRowUpdate = (newRow) => {
        
        let updatedRow
        if (!newRow.isMain){
           
            const index = details.findIndex(item => item.id === newRow.index);

            if (index === -1) return

            const newData = JSON.parse(JSON.stringify(details[index]))
                
            if(newData.technicians[newRow.technician_id] === newRow.technicians ){
            
                newData.assignmentHours[newRow.technician_id] = Number(newRow.hours_assigned)

                const newChange = {
                    type:"assignment",
                    action:"edit",
                    prevData: details[index],
                    newData: newData,
                }

                setChanges([...changes, newChange])

            }else{

                newData.technicians[newRow.technician_id] = newRow.technicians
                newData.assignmentHours[newRow.technician_id] = Number(newRow.hours_assigned)
                
                const newChange = {
                    type:"assignment",
                    action:"edit",
                    prevData: details[index],
                    newData: newData,
                }

                setChanges([...changes, newChange])

            }
            // await addAssignment(newAssignment)
            // fetchDetails()
                
        }else{

            const index = details.findIndex(item => item.id === newRow.index);
        
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
        setDetails(details.map((row) => (row.id === newRow.index ? updatedRow : row)));
         
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
                case "startDate": return false
                case "endDate": return false

                default: return true
            }
        }
    }
    
    const selectOptions = (params) => {

        const index = details.findIndex(item => item.id === params.row.index);
        if (index === -1) return [];
    
        // Filtrando los técnicos ya asignados a esta fase
        const technicians_assigned = details[index].technicians.map(technician => technician.trim());
        
        // Filtrando los técnicos disponibles que aún no están asignados
        const filteredTechnicians = technicians
            .filter(technician => !technicians_assigned.includes(technician.name.trim()))
            .map(technician => ({
                id: technician.id,
                name: technician.name,
            }));
   
        return filteredTechnicians;
    };

    const handleSelectChange = (event, rowId) => {
        // const selectedTechnicianId = event.target.value;
        // const updatedDetails = details.map(row => {
        //     if (row.id === rowId) {
        //         const updatedTechnicians = [...row.techniciansIds, selectedTechnicianId];
        //         row.techniciansIds = updatedTechnicians;
        //         // Si tienes otro estado para manejar las horas, también las agregarías aquí
        //     }
        //     return row;
        // });
        // setDetails(updatedDetails);
    };

    const columns = [
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
                    {"Ver Técnicos"}
                  </Box>
                ) : (
                    <FormControl fullWidth>
                        <Select
                            value={params.row.technician_id}
                            onChange={(event) => handleSelectChange(event, params.row.id)}
                        >
                               <MenuItem key={params.row.technician_id} value={params.row.technician_id}>
                                 {params.row.technicians}
                                </MenuItem>
                            {selectOptions(params).map((technician) => (
                                <MenuItem key={technician.id} value={technician.id}>
                                    {technician.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                          onClick={() => {handleDeleteClick(params.row)}}
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
                          onClick={() => {handleCancelClick(params.row)}}
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
                            toolbar={EditToolbar}
                            toolbarProps={{setDetails, setChanges, id}}
                            />
                    </Box>
                </Card>
            </Box>

        </Grid2>
        ) 
    )
}
