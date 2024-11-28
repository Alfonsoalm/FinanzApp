import logo from '../../assets/logo.png'
import {Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography, useTheme } from "@mui/material"

export const SideBar = ({drawerWidth = 240}) => {
  const theme = useTheme();
  return (
    <Box
      component="nav"
      sx={{width: {sm: {drawerWidth}}, flexShrink:{sm: 0}}}
    >

      <Drawer
        variant='permanent'
        open
        sx={{
          display:{xs:"block"},
          "& .MuiDrawer-paper": {boxSizing: "border-box", width: {drawerWidth},
          backgroundColor: theme.palette.background.color, color:theme.palette.text.secondary
        }
        }}
      >

        <Toolbar>
          <Typography variant="h6" noWrap component="div"> 
            Alberto Adamuz Priego
          </Typography>
        </Toolbar>
        <Divider/> 

        <List>
          {
            ["Tu área", "Proyectos", "Personal", "Informes", "Avisos", "Ajustes", "Información"].map(text => (
              <ListItem key={text} disablePadding >
                <ListItemButton sx={{textAlign:"center"}}>
                  <ListItemText primary={text}/>
                </ListItemButton>
              </ListItem>
            ))
          }
        </List>

        <Box sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          textAlign: "center"
          }}
        >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                width: "80%",    // Tamaño de la imagen (ajustable)
                height: "auto",   // Mismo tamaño en altura para mantener el formato cuadrado
                objectFit: "cover", // Mantiene la proporción de la imagen
              }}
            />
        </Box>
        
      </Drawer>


    </Box>
  )
}
