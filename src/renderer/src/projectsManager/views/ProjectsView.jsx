import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, Grid2, Typography } from "@mui/material";
import { GridActionsCellItem, GridDeleteIcon } from "@mui/x-data-grid";
import queryString from "query-string";
import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchBy } from "../../helper/searchBy";
import { useForm } from "../../hooks/useForm";
import { DataTable, SearchForm } from "../components";
import { ProjectManagerContext } from "../context/ProjectsManagerContext";

export const ProjectsView = () => {
    
    const navigate = useNavigate()
    const location = useLocation()

    const {projects, getProjects, deleteProject} = useContext(ProjectManagerContext)

    const {q=""} = queryString.parse(location.search)
    
    const [filteredProjects, setFilteredProjects] = useState(projects)
    const {searchText, onInputChange} = useForm({
        searchText: q,
    })

    useEffect(() => {
        getProjects()
    },[])


    useEffect(() => {

        const filtered = searchBy(projects, "name", searchText)
        setFilteredProjects(filtered)

        if (searchText !== q) {
            navigate(`?q=${searchText}`, { replace: true }); // Reemplaza en lugar de agregar al historial
        }
    
    }, [searchText, projects])


    const goToAddProjectView = () => {
        navigate("/projects/add")
    }

    const goToProjectDetailsView = (id) => {
        navigate(`/projects/${id}`)
    }

    const columns = useMemo(() => [
        { field: 'id', headerName: 'ID', width: 50, type:"number" },
        { field: 'name', headerName: 'Nombre', width: 200 },
        { field: 'headquarter', headerName: 'Sede', width: 100 },
        { field: 'type', headerName: 'Tipo', width: 100},
        { field: 'startDate', headerName: 'Fecha Inicio', width: 100},
        { field: 'endDate', headerName: 'Fecha Fin', width: 100 },
        { field: "status", headerName:"Estado", width: 200, type: "singleSelect", valueOptions: ["Adjudicación pendiente", "En desarrollo", "Finalizado", ""], editable: false },
        {
            field: 'actions',
            type: 'actions',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                key={"edit"}
                icon={<VisibilityIcon />}
                label="Editar"
                onClick={() => goToProjectDetailsView(params.id)}
                />,
                <GridActionsCellItem
                key={"delete"}
                icon={<GridDeleteIcon />}
                label="Borrar"
                onClick={() => deleteProject(params.id)}
                />,
            ],
        },
    ], [])



    return (
        <Grid2 
            container
            spacing={2}  // Ajuste del espaciado
            direction="column"
            alignItems="flex-start"  // Alineación a la izquierda del contenido
            sx={{pt: 2, pr:4,}}
            width={"100%"}
        >

            {/* Título alineado a la izquierda */}
            <Typography variant="h2" fontSize={30} fontWeight={500} sx={{ alignSelf: "flex-start" }}>
                Proyectos
            </Typography>

            <Grid2 container sx={{ width: "100%", pl: 4 , pr:4}} spacing={1} alignItems="center">

                <SearchForm searchText={searchText} onInputChange={onInputChange}/>
                                
                {/* Botón Añadir */}
                <Grid2>
                    <Button sx={{ width: "auto" }} variant="contained" color="secondary" onClick={goToAddProjectView}>
                        <Typography color="white">+ Añadir</Typography>
                    </Button>
                </Grid2>
            </Grid2>

            <Grid2 container variant="div" display="flex" justifyContent="center" sx={{ width: "100%", pl: 4 , pr:4}} spacing={1} alignItems="center">
                <DataTable initialRows={filteredProjects} columns={columns}/>
            </Grid2>

        </Grid2>
    );
}
