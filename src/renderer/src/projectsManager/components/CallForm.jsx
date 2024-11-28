import { useTheme } from "@emotion/react"
import { Box, Button, Grid2, TextField, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { useState } from "react"
import { useForm } from "../../hooks"

export const CallForm = () => {

    const theme = useTheme()
    const {formState, name, year, limit_cost_time_cpa, limit_cost_time_cpb, limit_cost_time_cpc, onInputChange} = useForm({
        name:"",
        year: "",
        limit_cost_time_cpa: "",
        limit_cost_time_cpb: "",
        limit_cost_time_cpc: "",

    })
    const [error, setError] = useState({
      errorMessage:"",
      element:[]
    })

    // const onAddNewCall = async (event) => {
    //     event.preventDefault()
    //     setError({
    //         errorMessage:"",
    //         elements:[]
    //     })
    //     validate()

    //     if(error.elements.length > 0) return 

    //     const result = await window.api.insertProject(formState)
    //     if(result.success){
    //       return
    //     } else{
    //         setError({
    //             errorMessage:"Error al añadir el proyecto",
    //             elements:["text"]
    //         })
    //     }
        
    // }

    const formatDates = (event, name) => {

        const date = event.format('YYYY-MM-DD')
        
        onInputChange({
            target:{
                name,
                value:date
            }
        })
    }

    // const validate = () => {

    //     setError({
    //         errorMessage:"",
    //         elements:[]
    //     })

    //     if(!name) return setError({elements:["name"], errorMessage:"Este campo es obligatorio"})
        
    // }

    return (
        <Box
            sx={{
            width: "100%",
            maxHeight: 400,
            maxWidth: 600,
            mx: "auto", // Centra horizontalmente
            mt: 4,
            p: 3,
            gap: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            boxShadow: 2,
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
                  id="name"
                  name="name"
                  type="text"
                  label="Nombre"
                  value={name}
                  onChange={onInputChange}
                  error={error.element.includes("name")}
                  helperText={error.element.includes("name") && error.errorMessage}
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
                  name="limit_cost_time_cpa"
                  type="number"
                  label="Límite €/h CPA"
                  error={error.element.includes("CPA")}
                  helperText={error.element.includes("CPA") && error.errorMessage}
                  value={limit_cost_time_cpa}
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
                  name="limit_cost_time_cpb"
                  type="number"
                  label="Límite €/h CPB"
                  error={error.element.includes("CPB")}
                  helperText={error.element.includes("CPB") && error.errorMessage}
                  value={limit_cost_time_cpb}
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
                  name="limit_cost_time_cpc"
                  type="number"
                  label="Límite €/h CPC"
                  error={error.element.includes("CPC")}
                  helperText={error.element.includes("CPC") && error.errorMessage}
                  value={limit_cost_time_cpc}
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


           

            {/* Botón Añadir */}
            <Grid2 xs={12} display="flex" justifyContent="center" mt={1} >
                <Button variant="contained" color="primary" width="100%" sx={{color: "text.contrast"}}>
                Añadir
                </Button>
            </Grid2>
        </Box>

    )
}
