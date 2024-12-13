import { GridActionsCellItem } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";


export const getProjectListColumns = (detailsProjectPage, deleteProject) => [
    { field: "id", headerName: "ID", width: 50, type: "number" },
    { field: "name", headerName: "Nombre", width: 200 },
    { field: "headquarter", headerName: "Sede", width: 100 },
    { field: "type", headerName: "Tipo", width: 100 },
    { field: "startDate", headerName: "Fecha Inicio", width: 100 },
    { field: "endDate", headerName: "Fecha Fin", width: 100 },
    { field: "status", headerName: "Estado", width: 200, type: "singleSelect", valueOptions: ["Pendiente", "Desarrollo", "Finalizado"] },
    {
        field: "actions",
        type: "actions",
        width: 80,
        getActions: (params) => [
            <GridActionsCellItem key={"edit"} icon={<VisibilityIcon />} label="Editar" onClick={() =>  detailsProjectPage(params.id)} />,
            <GridActionsCellItem key={"delete"} icon={<DeleteIcon />} label="Borrar" onClick={() => deleteProject(params.id)} />,
        ],
    },
];