import { Box } from "@mui/material"
import { SideBar, NavBar } from "../components"
import { useTheme } from "@emotion/react"
import { useEffect, useRef, useState } from "react"

const drawerWidth= 240

export const ProjectManagerLayout = ({children}) => {

  const theme = useTheme()
  const navRef = useRef()
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }

  }, [navRef]);

  return (
    
    <Box sx={{display: "flex", height:"100vh", backgroundColor: "background.default", color: theme.palette.text.terciary }}>
        <NavBar  ref={navRef} drawerWidth={drawerWidth}/>
        <SideBar drawerWidth={drawerWidth}/>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: `calc(100vh - ${navHeight}px - 64px)`, // Esto toma toda la altura menos la altura del Navbar
            width: "100%",
            marginLeft: `${drawerWidth}px`, // Asegura que el contenido no quede debajo del Sidebar
            // overflowY: "auto", // Asegura que el contenido sea desplazable si es más largo que la vista
            paddingTop: "64px"
          }}
        >
            {children}
        </Box>
    </Box>



  )
}
