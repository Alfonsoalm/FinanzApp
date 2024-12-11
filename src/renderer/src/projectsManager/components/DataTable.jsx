import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";



export const DataTable = ({initialRows=[], columns, getRowClassNameFunction = () => {}}) => {

    const theme = useTheme()

    const [rows, setRows] = useState(initialRows);

    useEffect(() => {
        setRows(initialRows);
    }, [initialRows]);

    return (
        <Box sx={{ display: "flex", flexDirection:"column", width: "auto", maxWidth: "100%", height:"auto", m:0}}>
            
                <DataGrid 
                    rows={rows} 
                    columns={columns} 
                    getRowId={row => row.id}
                    getRowClassName={getRowClassNameFunction}
                    pagination={false}
                    rowHeight={40}
                    sx={{
                        color: theme.palette.text.tercitary,
                        width: "auto",  // Esto asegura que el DataGrid ocupe solo el ancho mínimo necesario
                        maxWidth: "100%",  // Asegura que no se expanda más allá de su contenedor
                    }}
                />
            
        </Box>
  )
}
