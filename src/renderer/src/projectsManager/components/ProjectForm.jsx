import { useTheme } from "@emotion/react"
import { Box, Button, FormControl, Grid2, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import { useForm, useWindowApi } from "../../hooks"
import dayjs from "dayjs"


const getCalls = async () => {
    return await window.api.getCalls()
}

const getHeadquarters = async () => {
    return await window.api.getHeadquarters()
}

const apiMethods = [getCalls, getHeadquarters]


export const ProjectForm = () => {

    const theme = useTheme()

    const {data, isLoading} =  useWindowApi({apiMethods: apiMethods})
    const [{data: calls}, {data: headquarters}] = isLoading ? [[], []] : data

    
    const {formState, name, headquarter, call, startDate, endDate, budget, onInputChange} = useForm({
        name:"",
        headquarter: "",
        call: "",
        startDate: dayjs(),
        endDate: dayjs(),
        budget: "",
    })

    const onAddNewProject = (event) => {
        event.preventDefault()
        console.log("SUBMIT")

        console.log(formState)
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

    

    return (
        <Box
            sx={{
            width: "100%",
            maxHeight: 400,
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

            {/* Botón Añadir */}
            <Grid2 xs={12} display="flex" justifyContent="center" mt={2}>
                <Button onClick={onAddNewProject} variant="contained" color="primary" width="100%" sx={{color: "text.contrast"}}>
                    Añadir
                </Button>
            </Grid2>
        </Box>

    )
}
