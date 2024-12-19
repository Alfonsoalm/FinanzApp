import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';
import {Box, Divider, Drawer, List, ListItem, ListItemButton, Toolbar, Typography, useTheme } from "@mui/material"


const navLinks = [
  {
    name:"Tu area",
    path:"/area",
  },
  {
    name:"Proyectos",
    path:"/projects",
  },
  {
    name:"Personal",
    path:"/technicians",
  },
  {
    name:"Informes",
    path:"/inform",
  },
  {
    name:"Avisos",
    path:"/",
  },
  {
    name:"Ajustes",
    path:"/",
  },
  {
    name:"Información",
    path:"/",
  },
]

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
            navLinks.map((item) => (
              <ListItem key={item.name} disablePadding > 
                  <ListItemButton sx={{textAlign:"center"}}>
                     <NavLink to={item.path} style={{width:"100%", color: "inherit", textDecoration:"none"}}>
                      {item.name}
                    </NavLink>
                  </ListItemButton>
          
                {/* <ListItemButton sx={{textAlign:"center"}}>
                  <ListItemText primary={text}/>
                </ListItemButton>*/}
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
