import { useState } from "react";
import { Box, Button, Grid2, Typography } from "@mui/material";
import { VacationView } from "./VacationView";
import { WorkDaysView } from "./WorkDaysView";

export const AreaView = () => {
  const [currentView, setCurrentView] = useState("vacation");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%", // Ocupa todo el ancho de la página
        height: "100vh", // Ocupa todo el alto de la ventana
        overflow: "hidden",
        padding: 4, // Espaciado interno
      }}
    >
      {/* Title */}
      <Box sx={{ textAlign: "left", mb: 3 }}> {/* Alineación del título a la izquierda */}
        <Typography variant="h4">Área Personal</Typography>
      </Box>

      {/* Buttons to toggle views */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2, mb: 3 }}>
        <Button
          variant={currentView === "vacation" ? "contained" : "outlined"}
          onClick={() => setCurrentView("vacation")}
        >
          Vacaciones
        </Button>
        <Button
          variant={currentView === "workdays" ? "contained" : "outlined"}
          onClick={() => setCurrentView("workdays")}
        >
          Jornadas
        </Button>
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto", // Habilita scroll si el contenido supera el alto
          width: "100%", // Ocupa todo el ancho disponible
        }}
      >
        {currentView === "vacation" ? <VacationView /> : <WorkDaysView />}
      </Box>
    </Box>
  );
};
