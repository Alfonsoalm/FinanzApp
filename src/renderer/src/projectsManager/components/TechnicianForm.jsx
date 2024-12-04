import { useTheme } from "@emotion/react"
import { Box, Button, FormControl, Grid2, InputLabel, MenuItem, Select, TextField, Typography, Checkbox, FormControlLabel } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { useContext, useEffect, useState } from "react"
import { useForm } from "../../hooks"
import { ProjectManagerContext } from "../context/ProjectsManagerContext"

export const TechnicianForm = ({closeView}) => {

    const theme = useTheme()

    const {headquarters, getHeadquarters, insertTechnician, getTechnicians, error} = useContext(ProjectManagerContext);
    const [errorText, setErrorText] = useState({
        errorMessage:"",
        elements:[],
    })
    
    const {formState, name, role, wage_reductions, headquarter, hours_work, join_date, nationalId, username, password, is_active, is_admin, onInputChange} = useForm({
        name:"",
        role: "",
        wage_reductions: null,
        headquarter: "",
        hours_work: null,
        join_date: "",
        nationalId: "",
        username: "",
        password: "1234",
        is_active: false,
        is_admin: false,
    })

    useEffect(() => {
        getTechnicians(); 
        getHeadquarters();
    }, []);

    const onAddNewTechnician = async (event) => {
        event.preventDefault()
        setErrorText({
            errorMessage:"",
            elements:[]
        })
        
        if(!validate()) return

        try {
            insertTechnician(formState);
            console.log(formState)
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
        console.log("validando")

        setErrorText({
            errorMessage:"",
            elements:[]
        })

        if(!name){
            setErrorText({elements:["name"], errorMessage:"Este campo es obligatorio"})
            console.log("name")
            return false
        }
        if(!role){
            setErrorText({elements:["role"], errorMessage:"Este campo es obligatorio"})
            console.log("role")
            return false
        }
        if(!wage_reductions){
            setErrorText({elements:["wage_reductions"], errorMessage:"Este campo es obligatorio"})
            console.log("wage_reductions")
            return false
        }
        if(!headquarters){
            setErrorText({elements:["headquarters"], errorMessage:"Este campo es obligatorio"})
            console.log("headquarters")
            return false
        }
        if(!hours_work){
            setErrorText({elements:["hours_work"], errorMessage:"Este campo es obligatorio"})
            console.log("hours_work")
            return false
        }
        if(!join_date){
            setErrorText({elements:["join_date"], errorMessage:"Este campo es obligatorio"})
            console.log("join_date")
            return false
        }
        if(!nationalId){
            setErrorText({elements:["nationalId"], errorMessage:"Este campo es obligatorio"})
            console.log("nationalId")
            return false
        }
        if(!username){
            setErrorText({elements:["username"], errorMessage:"Este campo es obligatorio"})
            console.log("username")
            return false
        }
        if(!password){
            setErrorText({elements:["password"], errorMessage:"Este campo es obligatorio"})
            console.log("password")
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
            Nuevo Tecnico
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

            {/* Campo Rol */}
            <Grid2 container xs={12} spacing={2}>
                <TextField
                required
                error={!!errorText.elements.includes("role")}
                helperText={errorText.elements.includes("role") && errorText.errorMessage}
                id="role"
                name="role"
                type="text"
                label="Rol"
                fullWidth
                size="small"
                variant="outlined"
                value={role}
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

            {/* Campo Disminucion Salarial */}
            <Grid2 container xs={12} mt={2}>
                <TextField
                required
                error={!!errorText.elements.includes("wage_reductions")}
                helperText={errorText.elements.includes("wage_reductions") && errorText.errorMessage}
                id="wage_reductions"
                name="wage_reductions"
                type="number"
                label="Disminucion Salarial"
                fullWidth
                size="small"
                variant="outlined"
                value={wage_reductions}
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

            {/* Campo Sede */}
            <Grid2 container xs={12} mt={2}>
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
            </Grid2>

            {/* Campo Horas de jornada */}
            <Grid2 container xs={12} mt={2}>
                <TextField
                required
                error={!!errorText.elements.includes("hours_work")}
                helperText={errorText.elements.includes("hours_work") && errorText.errorMessage}
                id="hours_work"
                name="hours_work"
                type="number"
                label="Horas de jornada"
                fullWidth
                size="small"
                variant="outlined"
                value={hours_work}
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
            
            {/* Campo Fecha de incorporacion */}
            <Grid2 container xs={12} mt={2}>
                <DatePicker
                    required
                    maxDate={dayjs(join_date)}
                    error={!!errorText.elements.includes("join_date")}
                    // helperText={error.elements.includes("startDate") && error.errorMessage}
                    id="join_date"
                    name="join_date"
                    label="Fecha de incorporacion"
                    value={dayjs(join_date)}
                    onChange={(event) => formatDates(event, "join_date")}
                    slotProps={{
                    textField: { fullWidth: true, size: "small" },
                    }}
                />
            </Grid2>

            {/* Campo DNI */}
            <Grid2 container xs={12} mt={2}>
                <TextField
                required
                error={!!errorText.elements.includes("nationalId")}
                helperText={errorText.elements.includes("nationalId") && errorText.errorMessage}
                id="nationalId"
                name="nationalId"
                type="text"
                label="DNI"
                fullWidth
                size="small"
                variant="outlined"
                value={nationalId}
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

            {/* Campo Usuario */}
            <Grid2 container xs={12} mt={2}>
                <TextField
                required
                error={!!errorText.elements.includes("username")}
                helperText={errorText.elements.includes("username") && errorText.errorMessage}
                id="username"
                name="username"
                type="text"
                label="usuario"
                fullWidth
                size="small"
                variant="outlined"
                value={username}
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

             {/* Campo Contraseña */}
             <Grid2 container xs={12} mt={2}>
                <TextField
                required
                error={!!errorText.elements.includes("password")}
                helperText={errorText.elements.includes("password") && errorText.errorMessage}
                id="password"
                name="password"
                type="password"
                label="contraseña"
                fullWidth
                size="small"
                variant="outlined"
                value={password}
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

            {/* Campo Esta Activo */}
            <Grid2 container xs={12} mt={2} alignItems="center">
            <FormControlLabel
                control={
                <Checkbox
                    checked={is_active === "true" || is_active === true} // Convertir a booleano si es necesario
                    onChange={(event) =>
                    onInputChange({
                        target: {
                        name: "is_active",
                        value: event.target.checked,
                        },
                    })
                    }
                />
                }
                label="Está Activo"
            />

            {/* Campo Es Admin */}
            <FormControlLabel
                control={
                <Checkbox
                    checked={is_admin === "true" || is_admin === true} // Convertir a booleano si es necesario
                    onChange={(event) =>
                    onInputChange({
                        target: {
                        name: "is_admin",
                        value: event.target.checked,
                        },
                    })
                    }
                />
                }
                label="Es Admin"
            />
            </Grid2>      
      
            <p style={{color:theme.palette.error.main, textAlign:"center", marginBottom:0}}>{!!errorText.elements.includes("text") && errorText.errorMessage}</p>

            {/* Botón Añadir */}
            <Grid2 xs={12} display="flex" justifyContent="center" mt={2}>
                <Button onClick={onAddNewTechnician} variant="contained" color="primary" width="100%" sx={{color: "text.contrast"}}>
                    Añadir
                </Button>
            </Grid2>
        </Box>

    )
}
