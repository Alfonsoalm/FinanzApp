import { useTheme } from "@emotion/react"
import { Box, Button, Grid2, TextField, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"

export const CallForm = () => {

    const theme = useTheme()
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
                    onChange={() => {}}
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
                  id="cp1"
                  name="cp1"
                  type="text"
                  label="Límite €/h CP1"
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
                  id="cp2"
                  name="cp2"
                  type="text"
                  label="Límite €/h CP2"
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
                  id="cp3"
                  name="cp3"
                  type="text"
                  label="Límite €/h CP3"
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
