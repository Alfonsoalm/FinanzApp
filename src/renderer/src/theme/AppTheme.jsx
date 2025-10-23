/* eslint-disable react/prop-types */
import { ThemeProvider } from "@emotion/react"
import { CssBaseline } from "@mui/material"
import { greenTheme } from "./green"

export const AppTheme = ({children}) => {
  return (
    <ThemeProvider theme={greenTheme}>
        <CssBaseline/>
        {children}
    </ThemeProvider>
  )
}
