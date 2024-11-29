import { useTheme } from "@emotion/react"
import { Box, Button, Grid2, TextField, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { useContext, useState } from "react"
import { useForm } from "../../hooks"
import { ProjectManagerContext } from "../context/ProjectsManagerContext"

export const CallForm = () => {

    const theme = useTheme()
    const {insertCall, error} = useContext(ProjectManagerContext);
    const {formState, type, year, limit_cost_time_cp_a, limit_cost_time_cp_b, limit_cost_time_cp_c, onInputChange, onResetForm} = useForm({
        type:"",
        year: null,
        limit_cost_time_cp_a: "",
        limit_cost_time_cp_b: "",
        limit_cost_time_cp_c: "",

    })

    const [errorText, setErrorText] = useState({
      errorMessage:"",
      elements:[]
    })

    const onAddNewCall = async (event) => {
        event.preventDefault()
        setErrorText({
            errorMessage:"",
            elements:[]
        })
        
        if(!validate()) return

        try{
            insertCall(formState)

            if(error){
                setErrorText({
                    errorMessage: error,
                    elements: ["text"],
                  });
            }else{
                onResetForm()
            }
        }catch(err){
            setErrorText({
                errorMessage: err.message || "No se pudo añadir la convocatoria",
                elements: [err.message],
            });
        }           
    }

    const formatDates = (event, name) => {

        const date = event.format('YYYY')
        
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

        if(!type){
            setErrorText({elements:["type"], errorMessage:"Este campo es obligatorio"})
            return false
        }
        if(!year){
            setErrorText({elements:["year"], errorMessage:"Este campo es obligatorio"})
            return false
        }
        if(!limit_cost_time_cp_a){
            setErrorText({elements:["CPA"], errorMessage:"Este campo es obligatorio"})
            return false
        }
        if(!limit_cost_time_cp_b){
            setErrorText({elements:["CPB"], errorMessage:"Este campo es obligatorio"})
            return false
        }
        if(!limit_cost_time_cp_c){
            setErrorText({elements:["CPC"], errorMessage:"Este campo es obligatorio"})
            return false
        }
        if(limit_cost_time_cp_a <= 0){
            setErrorText({elements:["CPA"], errorMessage:"Valor no válido"})
            return false
        }
        if(limit_cost_time_cp_b <= 0){
            setErrorText({elements:["CPB"], errorMessage:"Valor no válido"})
            return false
        }
        if(limit_cost_time_cp_c <= 0){
            setErrorText({elements:["CPC"], errorMessage:"Valor no válido"})
            return false
        }
        
        return true
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
            gap: 3,
            display:"flex",
            flexDirection:"column"
            }}
        >
            <Typography variant="h4" fontSize={24} fontWeight={500} textAlign="center" mb={1}>
            Nueva Convocatoria
            </Typography>

        
            {/* Campo Nombre */}
            <Grid2 container xs={12} spacing={2} >
              <Grid2 container xs={8} flexGrow={1}>
                <TextField
                  required
                  id="type"
                  name="type"
                  type="text"
                  label="Nombre"
                  value={type}
                  onChange={onInputChange}
                  error={errorText.elements.includes("type")}
                  helperText={errorText.elements.includes("type") && errorText.errorMessage}
                  fullWidth
                  size="small"
                  variant="outlined"
                  slotProps={{
                      style: {
                      color: theme.palette.text.primary,
                      },
                  }}
                />
              </Grid2>
              <Grid2 container xs={4}>
                <DatePicker
                    required
                    disablePast
                    id="year"
                    name="year"
                    label="Año"
                    value={dayjs(year)}
                    onChange={(event) => formatDates(event, "year")}
                    views={['year']}
                    slotProps={{
                    textField: {size: "small" },
                    }}
                />
              </Grid2>
            </Grid2>

            <Grid2 xs={8}>
                <TextField
                  required
                  id="cpa"
                  name="limit_cost_time_cp_a"
                  type="number"
                  label="Límite €/h CPA"
                  error={errorText.elements.includes("CPA")}
                  helperText={errorText.elements.includes("CPA") && errorText.errorMessage}
                  value={limit_cost_time_cp_a}
                  onChange={onInputChange}
                  fullWidth
                  size="small"
                  variant="outlined"
                  slotProps={{
                      style: {
                      color: theme.palette.text.primary,
                      },
                  }}
                />
            </Grid2>
            <Grid2 xs={8}>
                <TextField
                  required
                  id="cpb"
                  name="limit_cost_time_cp_b"
                  type="number"
                  label="Límite €/h CPB"
                  error={errorText.elements.includes("CPB")}
                  helperText={errorText.elements.includes("CPB") && errorText.errorMessage}
                  value={limit_cost_time_cp_b}
                  onChange={onInputChange}
                  fullWidth
                  size="small"
                  variant="outlined"
                  slotProps={{
                      style: {
                      color: theme.palette.text.primary,
                      },
                  }}
                />
            </Grid2>

            <Grid2 xs={8}>
                <TextField
                  required
                  id="cpc"
                  name="limit_cost_time_cp_c"
                  type="number"
                  label="Límite €/h CPC"
                  error={errorText.elements.includes("CPC")}
                  helperText={errorText.elements.includes("CPC") && errorText.errorMessage}
                  value={limit_cost_time_cp_c}
                  onChange={onInputChange}
                  fullWidth
                  size="small"
                  variant="outlined"
                  slotProps={{
                      style: {
                      color: theme.palette.text.primary,
                      },
                  }}
                />
            </Grid2>


            <p style={{color:theme.palette.error.main, textAlign:"center", marginTop:0, marginBottom:0}}>{!!errorText.elements.includes("text") && errorText.errorMessage}</p>


            {/* Botón Añadir */}
            <Grid2 xs={12} display="flex" justifyContent="center" mt={1} >
                <Button onClick={onAddNewCall} variant="contained" color="primary" width="100%" sx={{color: "text.contrast"}}>
                Añadir
                </Button>
            </Grid2>
        </Box>

    )
}
