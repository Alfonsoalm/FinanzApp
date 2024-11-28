import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";


export const greenTheme = createTheme({
    palette: {
        primary: {
            main: "#7DA641", // Verde principal, destaca bien sobre blanco
        },
        secondary: {
            main: "#87BF34", // Verde secundario, más brillante
        },
        tertiary: {
            main: "#035928", // Verde oscuro para elementos destacados
        },
        error: {
            main: red.A400, // Rojo para errores
        },
        background: {
            default: "#FFFFFF", // Blanco como fondo principal
            paper: "#F2F1E9",   // Fondo de componentes como Paper o Drawer
        },
        text: {
            primary: "#035928", // Verde oscuro para el texto principal
            secondary: "#7DA641", // Verde medio para texto secundario
            contrast: "#FFFFFF", // Blanco para textos sobre fondo verde oscuro
        },
    },
});

