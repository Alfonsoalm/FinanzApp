import { LogoutOutlined, MenuOpenOutlined } from "@mui/icons-material";
import { AppBar, Grid2, IconButton, Toolbar, Typography } from "@mui/material";
import { forwardRef } from "react";


export const NavBar = forwardRef( function NavBar({ drawerWidth = 240 }, ref) {
    return (
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "inherit",
          color: "inherit",
          pl: 4,
          pr: 4,
        }}
        ref={ref} // Asigna el ref a AppBar
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuOpenOutlined />
          </IconButton>
  
          <Grid2 container width="100%" direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h1" noWrap component="div" fontSize={40} fontWeight={600}>
              Project Manager
            </Typography>
            <IconButton color="red">
              <LogoutOutlined />
            </IconButton>
          </Grid2>
        </Toolbar>
      </AppBar>
    );
  });
