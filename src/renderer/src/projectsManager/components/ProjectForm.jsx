import { useTheme } from "@emotion/react"
import { Box, Button, FormControl, Grid2, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { useContext, useEffect, useState } from "react"
import { useForm } from "../../hooks"
import { ProjectManagerContext } from "../context/ProjectsManagerContext"



export const ProjectForm = ({closeView}) => {

    const theme = useTheme()
    const {calls, headquarters, getCalls, getHeadquarters, insertProject, error} = useContext(ProjectManagerContext);
    const [errorText, setErrorText] = useState({
        errorMessage:"",
        elements:[]
    })
    
    const {formState, name, headquarter, call, startDate, endDate, budget, onInputChange} = useForm({
        name:"",
        headquarter: "",
        call: "",
        startDate: null,
        endDate: null,
        budget: "",
    })

    useEffect(() => {
        getCalls(); 
        getHeadquarters();   
    }, []);

    const onAddNewProject = async (event) => {
        event.preventDefault()
        setErrorText({
            errorMessage:"",
            elements:[]
        })
        
        if(!validate()) return

        try {
            insertProject(formState);
            if (error) {
              setErrorText({
                errorMessage: error,
                elements: ["text"],
              });
            } else {
              closeView()
            }
        } catch (err) {
            setErrorText({
                errorMessage: err.message || "No se pudo añadir el proyecto",
                elements: [err.message],
            });
        }

    }

    const formatDates = (event, name) => {

        const date = event.format('YYYY-MM-DD')
        
        onInputChange({
            target:{
                name,
                value:date
            }
        })
    }

    const validate = () => {

        setErrorText({
            errorMessage:"",
            elements:[]
        })

        if(!name){
            setErrorText({elements:["name"], errorMessage:"Este campo es obligatorio"})
            return false
        }
        if(!headquarter){
            setErrorText({elements:["headquarter"], errorMessage:"Este campo es obligatorio"})
            return false
        }
        if(!call){
            setErrorText({elements:["call"], errorMessage:"Este campo es obligatorio"})
            return false
        }
        if(!startDate){
            setErrorText({elements:["startDate"], errorMessage:"Este campo es obligatorio"})
            return false
        }
        if(!endDate){
            setErrorText({elements:["endDate"], errorMessage:"Este campo es obligatorio"})
            return false
        }
        if(!budget){
            setErrorText({elements:["budget"], errorMessage:"Este campo es obligatorio"})
            return false
        }
        if(budget < 0){
            setErrorText({elements:["budget"], errorMessage:"Valor no  válido"})
            return false
        }
        
        return true
    }

    

    return (
        <Box
            sx={{
            width: "100%",
            maxHeight: 450,
            maxWidth: 600,
            mx: "auto", // Centra horizontalmente
            mt: 4,
            p: 3,
            gap: 1,
            display:"flex",
            flexDirection:"column"
            }}
        >
            <Typography variant="h4" fontSize={24} fontWeight={500} textAlign="center" mb={3}>
            Nuevo Proyecto
            </Typography>

        
            {/* Campo Nombre */}
            <Grid2 container xs={12} marginBottom={2} >
                <TextField
                required
                error = {!!errorText.elements.includes("name")}
                helperText={errorText.elements.includes("name") && errorText.errorMessage}
                id="name"
                name="name"
                type="text"
                label="Nombre"
                fullWidth
                size="small"
                variant="outlined"
                slotProps={{
                    style: {
                    color: theme.palette.text.primary,
                    },
                }}
                value={name}
                onChange={onInputChange}
                />
            </Grid2>

            {/* Campos de Selección */}
            <Grid2 container xs={12} spacing={2}>
                <Grid2 xs={6}>
                <FormControl fullWidth sx={{minWidth:266}}>
                    <InputLabel id="headquarter-label">Sede</InputLabel>
                    <Select
                    required
                    error={!!errorText.elements.includes("headquarter")}
                    // helperText={error.elements.includes("headquarter") && error.errorMessage}
                    labelId="headquarter-label"
                    name="headquarter"
                    id="headquarter"
                    fullWidth
                    value={headquarter}
                    onChange={onInputChange}
                    >
                    <MenuItem disabled value="">
                    </MenuItem>
                    {
                        headquarters && headquarters.map(headquarter => (
                            <MenuItem key={headquarter.id} value={headquarter.id}>{headquarter.name}</MenuItem>
                        ))
                    }
                    </Select>
                </FormControl>
                </Grid2>

                <Grid2 xs={6}>
                <FormControl fullWidth sx={{minWidth:266}}>
                    <InputLabel id="call-label">Convocatoria</InputLabel>
                    <Select
                    required
                    error={!!errorText.elements.includes("call")}
                    labelId="call-label"
                    name="call"
                    id="call"
                    value={call}
                    onChange={onInputChange}
                    >
                    <MenuItem disabled value="">
                    </MenuItem>
                    {
                        calls && calls.map(call => (
                            <MenuItem key={call.id} value={call.id}>{call.type}, {call.year}</MenuItem>
                        ))
                    }
                    </Select>
                </FormControl>
                </Grid2>


            {/* Campos de Fechas */}
            <Grid2 container xs={12} spacing={2}>
                <Grid2 xs={6} sx={{minWidth:266}}>
                <DatePicker
                    required
                    disablePast
                    maxDate={dayjs(endDate)}
                    error={!!errorText.elements.includes("startDate")}
                    // helperText={error.elements.includes("startDate") && error.errorMessage}
                    id="startDate"
                    name="startDate"
                    label="Fecha Inicio"
                    value={dayjs(startDate)}
                    onChange={(event) => formatDates(event, "startDate")}
                    slotProps={{
                    textField: { fullWidth: true, size: "small" },
                    }}
                />
                </Grid2>

                <Grid2 xs={6} sx={{minWidth:266}}>
                <DatePicker 
                    required
                    disablePast
                    minDate={dayjs(startDate)}
                    error={!!errorText.elements.includes("endDate")}
                    // helperText={error.elements.includes("endDate") && error.errorMessage}
                    id="endDate"
                    name="endDate"
                    label="Fecha Fin"
                    value={dayjs(endDate)}
                    onChange={(event) => formatDates(event, "endDate")}
                    slotProps={{
                    textField: { fullWidth: true, size: "small" },
                    }}
                />
                </Grid2>
            </Grid2>
            
            </Grid2>

            <Grid2 container xs={12} mt={2}>
                <TextField
                required
                error={!!errorText.elements.includes("budget")}
                helperText={errorText.elements.includes("budget") && errorText.errorMessage}
                id="budget"
                name="budget"
                type="number"
                label="Presupuesto"
                fullWidth
                size="small"
                variant="outlined"
                value={budget}
                onChange={onInputChange}
                slotProps={{
                    style: {
                    color: theme.palette.text.primary,
                    },
                }}

                sx={{
                    width:"100%"
                }}
                />
            </Grid2>
            
      
            <p style={{color:theme.palette.error.main, textAlign:"center", marginBottom:0}}>{!!errorText.elements.includes("text") && errorText.errorMessage}</p>

            {/* Botón Añadir */}
            <Grid2 xs={12} display="flex" justifyContent="center" mt={2}>
                <Button onClick={onAddNewProject} variant="contained" color="primary" width="100%" sx={{color: "text.contrast"}}>
                    Añadir
                </Button>
            </Grid2>
        </Box>

    )
}
