import { Button, Grid2, Typography } from "@mui/material";
import queryString from "query-string";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchBy } from "../../helper/searchBy";
import { useForm } from "../../hooks/useForm";
import { DataTable, SearchForm } from "../components";
import { ProjectManagerContext } from "../context/ProjectsManagerContext";


export const TechniciansView = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const goToAddTechnicianView = () => {
        navigate("/technicians/add");
    }
    
    const goToTechnicianDetailsView = (id) => {
        console.log("Ir a vista de detalle de técnico con ID:", id);
        navigate(`/technicians/${id}`);
    }
    
    const deleteTechnician = (id) => {
        console.log("Borrar técnico con ID:", id);
    }

    const {technicians, getTechnicians} = useContext(ProjectManagerContext)

    const {q=""} = queryString.parse(location.search)
    const [filteredTechnicians, setFilteredTechnicians] = useState(technicians)
    const {searchText, onInputChange} = useForm({
        searchText: q,
    })

    useEffect(() => {
        getTechnicians()
    },[])


    useEffect(() => {
        const filtered = searchBy(technicians, "name", searchText)
        setFilteredTechnicians(filtered)

        if (searchText !== q) {
            navigate(`?q=${searchText}`, { replace: true }); // Reemplaza en lugar de agregar al historial
        }
    
    }, [searchText, technicians])

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, type:"number" },
        { field: 'name', headerName: 'Nombre', width: 200 },
        { field: 'role', headerName: 'Puesto', width: 100 },
        { field: 'wage_reductions', headerName: 'Disminuciones Salariales', width: 180},
        { field: 'headquarter', headerName: 'Sede', width: 90},
        { field: 'hours_work', headerName: 'Horas por jornada', width: 150},
        { field: 'join_date', headerName: 'Fecha Incorporacion', width: 180 },
        { field: "nationalId", headerName:"DNI", width: 130},
        { field: "username", headerName:"Usuario", width: 150},
        { field: "is_active", headerName:"Está activo", width: 100},
        { field: "is_admin", headerName:"Es administrador", width: 100},
        {
            field: "",
            headerName: "",
            width: 200,
            renderCell: (params) => (
                <div style={{ display: "flex", gap: "12px" }}>
                    {/* Botón Ver */}
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => {
                            goToTechnicianDetailsView(params.row.id)
                        }}
                    >
                        Ver
                    </Button>
                    {/* Botón Borrar */}
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => {
                            deleteTechnician(params.row.id)  
                        }}
                    >
                        Borrar
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <Grid2 
            container
            spacing={2}  // Ajuste del espaciado
            direction="column"
            alignItems="flex-start"  // Alineación a la izquierda del contenido
            sx={{pt: 2, pr:4,}}
            width={"90%"}
        >

            {/* Título alineado a la izquierda */}
            <Typography variant="h2" fontSize={30} fontWeight={500} sx={{ alignSelf: "flex-start" }}>
                Tecnicos
            </Typography>

            <Grid2 container sx={{ width: "100%", pl: 4 , pr:4}} spacing={1} alignItems="center">

                <SearchForm searchText={searchText} onInputChange={onInputChange}/>     
                {/* Botón Añadir */}
                <Grid2>
                    <Button sx={{ width: "auto" }} variant="contained" color="secondary" onClick={goToAddTechnicianView}>
                        <Typography color="white">+ Añadir</Typography>
                    </Button>
                </Grid2>
            </Grid2>

            <Grid2 container variant="div" display="flex" justifyContent="center" sx={{ width: "100%", pl: 4 , pr:4}} spacing={1} alignItems="center">
                <DataTable initialRows={filteredTechnicians} columns={columns} onRowDoubleClick={goToTechnicianDetailsView}/>
            </Grid2>

        </Grid2>
    );
}
