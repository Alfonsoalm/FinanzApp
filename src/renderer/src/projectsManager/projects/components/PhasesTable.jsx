/* eslint-disable react/prop-types */
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, FormControl, MenuItem, Select } from "@mui/material";
import { GridActionsCellItem, GridDeleteIcon, GridRowEditStopReasons, GridRowModes, useGridApiRef } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { DataTable } from "../../components";
import { ProjectManagerContext } from "../../context/ProjectsManagerContext";
import { RowExpansionService } from "../services/rowExpansionService";
import { RowService } from "../services/rowService";
import { RowActions } from "../utils/rowActions";
import { RowValidator } from "../utils/rowValidator";
import { EditToolbar } from "./EditToolbar";


const options = {
  getMainRow: (row) => (row.isMain ? row : null), // Función para obtener la fila principal
  getSubRows: (row) => row.technicians.map((tech, index) => ({
    id: `tech-${row.id}-${index}`,
    index: row.id,
    index_tech: index,
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

  }, [rows])


  const rowExpansionService = new RowExpansionService(expandedRows);
  const rowActions = new RowActions(rows, setRows, changes, setChanges, fetchData);
  
  const handleAddClick = (rowId) => rowActions.handleAddClick(rowId);
  const handleDeleteClick = (deletedRow) => rowActions.handleDeleteClick(deletedRow)
  const addNewChange = (newChange) => rowActions.addNewChange(newChange); 

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
    console.log(updatedRow)

    if(newRow.isMain){
      rowActions.editPhase(updatedRow)
    }else{
      rowActions.editAssignment(updatedRow)
    }
    console.log(updatedRow)
    return updatedRow;
  };


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

const handleRowEditStop = (params, event) => {
  if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
  }
};

const handleEditClick = (id) => {
  console.log("EDIT")
  setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
};

const handleSaveClick = (id) => {
  console.log("SAVE")
  setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
};

const handleCancelClick = (id) => {
  console.log("CANCEL")
  setRowModesModel({
    ...rowModesModel,
    [id]: { mode: GridRowModes.View, ignoreModifications: true },
  });


  const editedRow = rows.find((row) => row.id === id);
  if (editedRow.isNew) {
    setRows(rows.filter((row) => row.id !== id));
  }

};



const handleSelectChange = (event, id) => {

  const technician_id = event.target.value
  const technician = technicians.find((tech) => tech.id === technician_id)?.name 

  const newRow =  structuredClone(rows.find(row => row.id === id))

  newRow.technician_id = technician_id
  newRow.technicians = technician

  processRowUpdate(newRow)

};

const handleDateChange = (value, newRow, field, api) => {

  let updatedRow = structuredClone(newRow); // Asegúrate de hacer una copia profunda
  updatedRow = { ...updatedRow, [field]: value.format('YYYY-MM-DD') }; // Actualiza el campo de la fecha

  api.setEditCellValue({ id: updatedRow.id, field, value: value.format('YYYY-MM-DD')  });
  // api.commitCellChange();

  
};


const columns = [
    { field: 'name', headerName: 'Nombre', width: 300, editable:true},
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
                        onChange={(event) => handleSelectChange(event, params.row)}
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
    { field: 'hours_assigned', headerName: 'Horas Asignadas', width: 90, editable:true},
    { field: 'hours', headerName: 'Horas', width: 70,  editable:true },
    { field: 'startDate', headerName: 'Fecha Inicio', width: 150, editable:true,
        renderEditCell: (params) => (
          <FormControl fullWidth>
            <DatePicker
                value={params.value ? dayjs(params.value) : null}
                onChange={(value) => handleDateChange(value, params.row, "startDate", params.api)}
                slotProps={{ textField: { size: 'small' } }}
            />
            </FormControl>
        ),    
    },
    { field: 'endDate', headerName: 'Fecha Fin', width: 150, editable:true,
        renderEditCell: (params) => (
          <DatePicker
              value={params.value ? dayjs(params.value) : null}
              onChange={(value) => handleDateChange(value, params.row, "endDate", params.api)}
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
