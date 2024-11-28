import { useTheme } from "@emotion/react";
import { Button, Grid2, Typography } from "@mui/material";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchBy } from "../../helper/searchBy";
import { useForm } from "../../hooks/useForm";
import { DataTable, SearchForm } from "../components";

// const example = Array.from({ length: 50 }, (_, index) => ({
//     id: index + 1, // ID único para cada fila
//     name: `Proyecto ${index + 1}`, // Nombre del proyecto
//     headquarter: `Sede ${Math.ceil(Math.random() * 5)}`, // Sede aleatoria (1 a 5)
//     type: `Tipo ${Math.ceil(Math.random() * 3)}`, // Tipo aleatorio (1 a 3)
//     start_date: `2024-01-${String(Math.ceil(Math.random() * 28)).padStart(2, '0')}`, // Fecha de inicio aleatoria
//     end_date: `2024-12-${String(Math.ceil(Math.random() * 28)).padStart(2, '0')}`, // Fecha de fin aleatoria
//     status: ["Adjudicación pendiente", "En desarrollo", "Finalizado"][Math.floor(Math.random() * 3)], // Estado aleatorio
//   }));

export const ProjectsView = ({projects, changeView}) => {

    const theme = useTheme()
    const navigate = useNavigate()
    const location = useLocation()


    const {q=""} = queryString.parse(location.search)
    const [filteredProjects, setFilteredProjects] = useState(projects)
    const {searchText, onInputChange} = useForm({
        searchText: "",
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
