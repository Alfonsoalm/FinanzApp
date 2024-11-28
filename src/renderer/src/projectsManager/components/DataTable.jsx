import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";



export const DataTable = ({initialRows}) => {

    const theme = useTheme()

    const [rows, setRows] = useState(initialRows);

    useEffect(() => {
        setRows(initialRows);
    }, [initialRows]);



    const columns = useMemo(() => [
        { field: 'id', headerName: 'ID', width: 50, type:"number" },
        { field: 'name', headerName: 'Nombre', width: 200 },
        { field: 'headquarter', headerName: 'Sede', width: 100 },
        { field: 'type', headerName: 'Tipo', width: 100},
        { field: 'start_date', headerName: 'Fecha Inicio', width: 100},
        { field: 'end_date', headerName: 'Fecha Fin', width: 100 },
        { field: "status", headerName:"Estado", width: 200, type: "singleSelect", valueOptions: ["Adjudicación pendiente", "En desarrollo", "Finalizado"], editable: true },
    ], [])

    return (
        <Box sx={{ width: "auto", maxWidth: "100%", height:"471px", mt:4}}>
            {
                rows.length > 0 && 
                <DataGrid 
                    rows={rows} 
                    columns={columns} 
                    getRowId={row => row.id}
                    autoPageSize
        
                    rowHeight={40}
                    sx={{
                        color: theme.palette.text.tercitary,
                        width: "auto",  // Esto asegura que el DataGrid ocupe solo el ancho mínimo necesario
                        maxWidth: "100%",  // Asegura que no se expanda más allá de su contenedor
                    }}
                />
            }
        </Box>
  )
}
