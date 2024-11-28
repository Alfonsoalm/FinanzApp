import { useTheme } from "@emotion/react"
import { SearchOutlined } from "@mui/icons-material"
import { FormControl, Grid2, InputAdornment, TextField } from "@mui/material"


export const SearchForm = ({searchText, onInputChange}) => {

    const theme = useTheme()

    return (
        <Grid2 sx={{ flexGrow: 1 }}>
            <FormControl sx={{ width: '100%', mt: 0 }}>
                <Grid2 container spacing={1} alignItems="center">
                    <Grid2 sx={{ flexGrow: 1 }}>
                        <TextField
                            id="search"
                            name="searchText"
                            type="search"
                            placeholder="Buscar proyectos..."
                            fullWidth
                            size="small"
                            variant="filled"
                            hiddenLabel
                            slotProps={{
                                input: {
                                    style: {
                                        color: theme.palette.text.tertiary,
                                    },

                                    startAdornment:(
                                        <InputAdornment position="start">
                                            <SearchOutlined/>
                                        </InputAdornment>
                                    )
                                },
                                
                            }}
                            value={searchText}
                            onChange={onInputChange}

                        />
                    </Grid2>
                </Grid2>
            </FormControl>
        </Grid2>                
    )
}
