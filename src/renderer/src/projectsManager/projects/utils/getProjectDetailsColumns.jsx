// import { Box, Button, FormControl, MenuItem, Select } from "@mui/material";
// import { GridActionsCellItem } from "@mui/x-data-grid";
// import { DatePicker } from "@mui/x-date-pickers";
// import dayjs from "dayjs";

// export const getProjectDetailsColumns = (expandedRows, toggleRow, handleSelectChange, selectOptions, rowModesModel) => [
//     { field: 'name', headerName: 'Nombre', width: 300, editable:true},
//     {   editable: true,
//         field: 'technicians', 
//         headerName: 'Técnicos', 
//         width: 200, 
//         renderCell: (params) => {

//             const isMain = params.row.isMain;
         
//             return isMain ? (
//               <Box sx={{ display: "flex", alignItems: "center" }}>
//                 <Button
//                   size="small"
//                   onClick={() => toggleRow(params.row.id)}
//                 >
//                   {expandedRows[params.row.id] ? "▼" : "►"}
//                 </Button>
//                 {"Ver Técnicos"}
//               </Box>
//             ) : (
//                 <FormControl fullWidth>
//                     <Select
//                         value={params.row.technician_id}
//                         onChange={(event) => handleSelectChange(event, params.row.id)}
//                     >
//                            <MenuItem key={params.row.technician_id} value={params.row.technician_id}>
//                              {params.row.technicians}
//                             </MenuItem>
//                         {selectOptions(params).map((technician) => (
//                             <MenuItem key={technician.id} value={technician.id}>
//                                 {technician.name}
//                             </MenuItem>
//                         ))}
//                     </Select>
//                 </FormControl>
//             );
//         },
//     },
//     { field: 'hours_assigned', headerName: 'Horas Asignadas', width: 100, editable:true},
//     { field: 'hours', headerName: 'Horas', width: 100,  editable:true },
//     { field: 'startDate', headerName: 'Fecha Inicio', width: 120, editable:true,
//         renderEditCell: (params) => (
//                 <DatePicker
//                     value={params.value ? dayjs(params.value) : null}
//                     slotProps={{ textField: { size: 'small' } }}
//                 />
//         ),    

//     },
//     { field: 'endDate', headerName: 'Fecha Fin', width: 120, editable:true,
//         renderEditCell: (params) => (
//             <DatePicker
//                 value={params.value ? dayjs(params.value) : null}
//                 slotProps={{ textField: { size: 'small' } }}
//             />
//     ),  
//     },
//     {
//         field: 'actions',
//         type: 'actions',
//         width: 120,
//         getActions: (params) => {
//             const isInEditMode = rowModesModel[params.row.id]?.mode === GridRowModes.Edit;
//             if(!isInEditMode){
//                 const actions = [
//                     <GridActionsCellItem
//                       key="edit"
//                       icon={<EditIcon />}
//                       label="Editar"
//                       onClick={() => handleEditClick(params.row.id)}
//                     />,
//                     <GridActionsCellItem
//                       key="delete"
//                       icon={<GridDeleteIcon />}
//                       label="Borrar"
//                       onClick={() => {handleDeleteClick(params.row)}}
//                     />,
//                   ];
              
//                   // Añadir el botón "Añadir" solo si `isMain` es true
//                   if (params.row.isMain) {
//                     actions.unshift(
//                       <GridActionsCellItem
//                         key="add"
//                         icon={<AddIcon />}
//                         label="Añadir"
//                         onClick={() => handleAddClick(params.row.id)}
//                       />
//                     );
//                   }
              
//                   return actions;
//             } else{

//                 const actions = [
//                     <GridActionsCellItem
//                       key="save"
//                       icon={<SaveIcon />}
//                       label="Guardar"
//                       onClick={() => {handleSaveClick(params.row.id)}}
//                     />,
//                     <GridActionsCellItem
//                       key="cancel"
//                       icon={<CancelIcon />}
//                       label="Cancelar"
//                       onClick={() => {handleCancelClick(params.row)}}
//                     />,
//                   ];
              
//                   return actions;

//             }

          
//         },
//     },

// ]