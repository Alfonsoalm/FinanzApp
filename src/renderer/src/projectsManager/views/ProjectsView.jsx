import { Button, Grid2, Typography } from "@mui/material";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchBy } from "../../helper/searchBy";
import { useWindowApi } from "../../hooks";
import { useForm } from "../../hooks/useForm";
import { DataTable, SearchForm } from "../components";


const fetchProjectData = async () => {
    return await window.api.getProjects()
  }
  
const apiMethods = [fetchProjectData]

export const ProjectsView = ({changeView}) => {
    
    const navigate = useNavigate()
    const location = useLocation()

    const {data, isLoading} = useWindowApi({apiMethods:apiMethods})
    console.log(data)
    const [{data:projects}] = isLoading ? [[]] : data;

    const {q=""} = queryString.parse(location.search)
    
    const [filteredProjects, setFilteredProjects] = useState(projects)
    const {searchText, onInputChange} = useForm({
        searchText: q,
    })


    useEffect(() => {
        navigate(`?q=${searchText}`);

        const filtered = searchBy(projects, "name", searchText)
        setFilteredProjects(filtered)
    
    }, [searchText, projects])
    

    return (
        <Grid2 
            container
            spacing={2}  // Ajuste del espaciado
            direction="column"
            alignItems="flex-start"  // Alineación a la izquierda del contenido
            sx={{ ml: 2, pt: 2, pl: 4, pr:4,}}
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
                    <Button sx={{ width: "auto" }} variant="contained" color="secondary" onClick={() => changeView("addProjects")}>
                        <Typography color="white">+ Añadir</Typography>
                    </Button>
                </Grid2>
            </Grid2>

            <Grid2 container variant="div" display="flex" justifyContent="center" sx={{ width: "100%", pl: 4 , pr:4}} spacing={1} alignItems="center">
                <DataTable initialRows={filteredProjects}/>
            </Grid2>

        </Grid2>
    );
}
