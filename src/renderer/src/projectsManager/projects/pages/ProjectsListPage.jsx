import { Button, Grid2, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "../../../hooks";
import { useSearch } from "../../../hooks/useSearch";
import { DataTable, SearchForm } from "../../components";
import { ProjectManagerContext } from "../../context/ProjectsManagerContext";
import { getProjectListColumns } from '../utils/getProjectListColumns';
import queryString from "query-string";

export const ProjectsListPage = () => {
    
    const navigate = useNavigate()
    const location = useLocation()
    const {q=""} = queryString.parse(location.search)
    
    const {projects, getProjects, deleteProject} = useContext(ProjectManagerContext)
    const {searchText, onInputChange} = useForm({searchText: q,})
    const {filteredList: filteredProjects} = useSearch({
        list: projects,
        searchText: searchText,
        field: "name",
    })

    //Navegación
    const goToAddProjectView = () => {
        navigate("/projects/add")
    }

    //Navegación
    const goToProjectDetailsView = (id) => {
        navigate(`/projects/${id}`)
    }

    //Actualiza la lista
    useEffect(() => {
        getProjects()
    },[getProjects])

    //Actualiza la url al cambiar la búsqueda
    useEffect(() => {

        if (searchText !== q) {
            navigate(`?q=${searchText}`, { replace: true }); // Reemplaza en lugar de agregar al historial
        }
    
    }, [searchText, projects])

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
                                
                <Grid2>
                    <Button sx={{ width: "auto" }} variant="contained" color="secondary" onClick={goToAddProjectView}>
                        <Typography color="white">+ Añadir</Typography>
                    </Button>
                </Grid2>
            </Grid2>

            <Grid2 container variant="div" display="flex" justifyContent="center" sx={{ width: "100%", pl: 4 , pr:4}} spacing={1} alignItems="center">
                <DataTable initialRows={filteredProjects} columns={getProjectListColumns(goToProjectDetailsView, deleteProject)}/>
            </Grid2>

        </Grid2>
    );
}
