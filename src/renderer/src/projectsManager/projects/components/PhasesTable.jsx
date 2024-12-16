/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { DataTable } from "../../components"
import { ProjectManagerContext } from "../../context/ProjectsManagerContext";
import { Box, Button, FormControl, MenuItem, Select } from "@mui/material";
import { GridActionsCellItem, GridDeleteIcon, GridRowEditStopReasons, GridRowModes } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { EditToolbar } from "./EditToolbar";
import { RowService } from "../services/rowService";
import { RowExpansionService } from "../services/rowExpansionService";
import { RowActions } from "../utils/rowActions";
import { RowValidator } from "../utils/rowValidator";


const options = {
  getMainRow: (row) => (row.isMain ? row : null), // Función para obtener la fila principal
  getSubRows: (row) => row.technicians.map((tech, index) => ({
    id: `tech-${row.id}-${index}`,
    index: row.id,
    technician_id: row.techniciansIds[index],
    technicians: tech,
    hours_assigned: row.assignmentHours[index],
    isMain: false,
  })),
};

export const PhasesTable = ({id_project, data, setData, changes, setChanges, fetchData}) => {
  const {technicians, addAssignment, deleteAssignments} = useContext(ProjectManagerContext)
  const [rows, setRows] = useState([])
  const [expandedRows, setExpandedRows] = useState({});
  const [rowModesModel, setRowModesModel] = useState({});



  useEffect(() => {
    const initialRows = data.map(item => ({...item, isMain:true}))
    const processedRows = RowService.formatRowData(initialRows, expandedRows, options);
    setRows(processedRows);
  }, [data])

  useEffect(() => {
    const processedRows = RowService.formatRowData(rows, expandedRows, options);
    setRows(processedRows);
  }, [expandedRows])

  useEffect(() => {
    console.log("CAMBIOS")
    console.log(changes)
    console.log(rows)
  }, [rows, changes])


  const rowExpansionService = new RowExpansionService(expandedRows);
  const rowActions = new RowActions(data, setData, setChanges, fetchData);
  
  // Manejador para expandir/colapsar filas
  const handleToggleRow = (id) => {
    rowExpansionService.toggleRow(id)
    setExpandedRows(rowExpansionService.getExpandedRows())
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleAddClick = (rowId) => rowActions.handleAddClick(rowId);
  const handleDeleteClick = (deletedRow) => rowActions.handleDeleteClick(deletedRow)


const selectOptions = (params) => {

  const index = data.findIndex(item => item.id === params.row.index);
  if (index === -1) return [];

  // Filtrando los técnicos ya asignados a esta fase
  const technicians_assigned = data[index].technicians.map(technician => technician.trim());
  
  // Filtrando los técnicos disponibles que aún no están asignados
  const filteredTechnicians = technicians
      .filter(technician => !technicians_assigned.includes(technician.name.trim()))
      .map(technician => ({
          id: technician.id,
          name: technician.name,
      }));

  return filteredTechnicians;
};


// const handleAddClick = async (rowId) => {
//   const index = data.findIndex(item => item.id === rowId);

//   if (index !== -1) {
          
//       const newAssignment = { 
//           technician: -1,
//           phase: data[index].id,
//           hours: 0,
//           startDate:data[index].startDate,
//           endDate:data[index].endDate,
//       }

//       await addAssignment(newAssignment)
//       fetchData()
//   }
// }

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

const handleCancelClick = (id) => {

  setRowModesModel({
    ...rowModesModel,
    [id]: { mode: GridRowModes.View, ignoreModifications: true },
  });


  const editedRow = rows.find((row) => row.id === id);
  if (editedRow.isNew) {
    setRows(rows.filter((row) => row.id !== id));
  }

};


// const handleDeleteClick = (deletedRow) => {

//   if (!deletedRow.isMain){

//       const index = data.findIndex(item => item.id === deletedRow.index);

//       if (index === -1) return

//       const newData = JSON.parse(JSON.stringify(data[index]))

          
//       if(deletedRow.technician_id >= newData.technicians.length ) return
      
//       newData.technicians.splice(deletedRow.technician_id, 1);
//       newData.techniciansIds.splice(deletedRow.technician_id, 1);
//       newData.assignmentHours.splice(deletedRow.technician_id, 1);

//       const newChange = {
//           type:"assignment",
//           action:"delete",
//           prevData: data[index],
//           newData: newData,
//       }

//       setChanges([...changes, newChange])

//       setData(data.map((row) => (row.id === deletedRow.index ? newData : row)));

      
  
//   }else{

//       const deteledData = data.filter((row) => row.id === deletedRow.index)
//       setData(data.filter((row) => row.id !== deletedRow.index));

//       const newChange = {
//           type:"phase",
//           action:"delete",
//           prevData: deteledData,
//           newData: {},
//       }

//       setChanges([...changes, newChange])

//   }
// };


// const processRowUpdate = (newRow) => {
  
//   let updatedRow
//   if (!newRow.isMain){
     
//       const index = data.findIndex(item => item.id === newRow.index);

//       if (index === -1) return

//       const newData = JSON.parse(JSON.stringify(data[index]))
          
//       if(newData.technicians[newRow.technician_id] === newRow.technicians ){
      
//           newData.assignmentHours[newRow.technician_id] = Number(newRow.hours_assigned)

//           const newChange = {
//               type:"assignment",
//               action:"edit",
//               prevData: data[index],
//               newData: newData,
//           }

//           setChanges([...changes, newChange])

//       }else{

//           newData.technicians[newRow.technician_id] = newRow.technicians
//           newData.assignmentHours[newRow.technician_id] = Number(newRow.hours_assigned)
          
//           const newChange = {
//               type:"assignment",
//               action:"edit",
//               prevData: data[index],
//               newData: newData,
//           }

//           setChanges([...changes, newChange])

//       }
//       // await addAssignment(newAssignment)
//       // fetchDetails()
          
//   }else{

//       const index = data.findIndex(item => item.id === newRow.index);
  
//       if(index === -1) return

//       const newData = JSON.parse(JSON.stringify(data[index]))

//       newData.name = newRow.name
//       newData.hours = Number(newRow.hours)
//       newData.startDate = newRow.startDate
//       newData.endDate = newRow.endDate

//       const newChange = {
//           type:"phase",
//           action:"edit",
//           prevData: data[index],
//           newData: newData,
//       }

//       setChanges([...changes, newChange])
//   }
  
//   updatedRow = { ...newRow, isNew: false };
//   setData(data.map((row) => (row.id === newRow.index ? updatedRow : row)));
   
//   return updatedRow;
// };



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
  // setData(updatedDetails);
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
                    onClick={() => handleToggleRow(params.row.id)}
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
                        onClick={() => {handleCancelClick(params.row.id)}}
                      />,
                    ];
                
                    return actions;

              }

            
          },
      },
    
    ]

  return (
      <DataTable initialRows={rows}  columns={columns} getRowClassNameFunction={(params) => params.row.isMain ? "main-row" : "secondary-row"}
          rowModesModel={rowModesModel}
          handleRowEditStop={handleRowEditStop}
          handleRowModesModelChange={handleRowModesModelChange}
          processRowUpdate={processRowUpdate}
          isCellEditable={RowValidator.isCellEditable}
          toolbar={EditToolbar}
          toolbarProps={{setData, setChanges, id_project}}
      />
  )
}
