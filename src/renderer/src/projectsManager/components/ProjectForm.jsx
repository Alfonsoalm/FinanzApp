import { useTheme } from "@emotion/react"
import { Box, Button, FormControl, Grid2, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import { useForm, useWindowApi } from "../../hooks"
import dayjs from "dayjs"
import { useState } from "react"


const getCalls = async () => {
    return await window.api.getCalls()
}

const getHeadquarters = async () => {
    return await window.api.getHeadquarters()
}

const apiMethods = [getCalls, getHeadquarters]


export const ProjectForm = ({closeView}) => {

    const theme = useTheme()

    const {data, isLoading} =  useWindowApi({apiMethods: apiMethods})
    const [{data: calls}, {data: headquarters}] = isLoading ? [[], []] : data
    const [error, setError] = useState({
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

    const onAddNewProject = async (event) => {
        event.preventDefault()
        setError({
            errorMessage:"",
            elements:[]
        })
        validate()

        if(error.elements.length > 0) return 

        const result = await window.api.insertProject(formState)
        if(result.success){
            closeView("projects")
        } else{
            setError({
                errorMessage:"Error al añadir el proyecto",
                elements:["text"]
            })
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

        setError({
            errorMessage:"",
            elements:[]
        })

        if(!name) return setError({elements:["name"], errorMessage:"Este campo es obligatorio"})
        if(!headquarter) return setError({elements:["headquarter"], errorMessage:"Este campo es obligatorio"})
        if(!call) return setError({elements:["call"], errorMessage:"Este campo es obligatorio"})
        if(!startDate) return setError({elements:["startDate"], errorMessage:"Este campo es obligatorio"})
        if(!endDate) return setError({elements:["endDate"], errorMessage:"Este campo es obligatorio"})
        if(!budget) return setError({elements:["budget"], errorMessage:"Este campo es obligatorio"})
        
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
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            boxShadow: 2,
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
                error = {!!error.elements.includes("name")}
                helperText={error.elements.includes("name") && error.errorMessage}
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
                    error={!!error.elements.includes("headquarter")}
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
                    error={!!error.elements.includes("call")}
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
                    error={!!error.elements.includes("startDate")}
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
                    error={!!error.elements.includes("endDate")}
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
                error={!!error.elements.includes("budget")}
                helperText={error.elements.includes("budget") && error.errorMessage}
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
            
      
            <p style={{color:theme.palette.error.main, textAlign:"center", marginBottom:0}}>{!!error.elements.includes("text") && error.errorMessage}</p>

            {/* Botón Añadir */}
            <Grid2 xs={12} display="flex" justifyContent="center" mt={1}>
                <Button onClick={onAddNewProject} variant="contained" color="primary" width="100%" sx={{color: "text.contrast"}}>
                    Añadir
                </Button>
            </Grid2>
        </Box>

    )
}
