import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Divider,
} from "@mui/material";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export const WorkDaysView = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [project, setProject] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("16:00");
  const [workDays, setWorkDays] = useState([]);
  const [holidays] = useState(["2024-12-25", "2024-01-01"]);

  const handleAddWorkDay = () => {
    if (!selectedDate || !project || !startTime || !endTime) {
      alert("Por favor, completa todos los campos");
      return;
    }

    const newWorkDay = {
      id: workDays.length + 1,
      date: selectedDate,
      project,
      startTime,
      endTime,
    };

    setWorkDays([...workDays, newWorkDay]);
    setSelectedDate(null);
    setProject("");
    setStartTime("08:00");
    setEndTime("16:00");
  };

  const handleDeleteWorkDay = (id) => {
    setWorkDays(workDays.filter((workDay) => workDay.id !== id));
  };

  const renderDayContent = (day) => {
    const formattedDay = day.toISOString().split("T")[0];
    if (holidays.includes(formattedDay)) {
      return (
        <Box
          sx={{
            backgroundColor: "red",
            color: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {day.getDate()}
        </Box>
      );
    }
    if (workDays.some((workDay) => workDay.date === formattedDay)) {
      return (
        <Box
          sx={{
            backgroundColor: "blue",
            color: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {day.getDate()}
        </Box>
      );
    }
    return <span>{day.getDate()}</span>;
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f9f9f9",
        width: "100%",
      }}
    >
      {/* Calendario */}
      <Box
        sx={{
          flex: 7,
          display: "flex",
          flexDirection: "column",
          padding: 3,
          backgroundColor: "#ffffff",
          borderRight: "1px solid #ddd",
        }}
      >
        <Card
          sx={{
            height: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: "100%",
              overflow: "hidden", // Oculta el overflow
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                value={selectedDate}
                onChange={(newValue) =>
                  setSelectedDate(newValue?.toISOString().split("T")[0])
                }
                renderDay={renderDayContent}
                sx={{
                  width: "600px", // Aumenta el ancho
                  maxHeight: "600px", // Aumenta la altura máxima
                  height: "auto", // Ajusta automáticamente si es necesario
                  overflow: "visible", // Quita el overflow si es necesario
                  "& .MuiDateCalendar-root": {
                    width: "100%",
                    height: "100%",
                  },
                  "& .MuiPickersCalendarHeader-root": {
                    fontSize: "1.5rem",
                  },
                  "& .MuiDayCalendar-root": {
                    height: "100%",
                  },
                  "& .MuiPickersDay-root": {
                    width: "80px", // Ajusta el tamaño de los días
                    height: "80px",
                    fontSize: "1.2rem",
                  },
                  "& .MuiPickersSlideTransition-root": {
                    overflowX: "visible", // Sobrescribe el overflow-x
                  },
                  "& .MuiPickersSlideTransition-root > *": {
                    position: "absolute", // Sobrescribe position
                    top: "0px", // Cambiar la posición
                    left: "10px", // Ajustar según tus necesidades
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Card>
      </Box>

      {/* Formulario */}
      <Box
        sx={{
          flex: 3,
          display: "flex",
          flexDirection: "column",
          padding: 3,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          Añadir nueva jornada
        </Typography>
        <Card sx={{ height: "auto", padding: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Fecha seleccionada"
                value={selectedDate || ""}
                disabled
                fullWidth
              />
              <TextField
                select
                label="Proyecto"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                fullWidth
              >
                <MenuItem value="Proyecto A">Proyecto A</MenuItem>
                <MenuItem value="Proyecto B">Proyecto B</MenuItem>
                <MenuItem value="Proyecto C">Proyecto C</MenuItem>
              </TextField>
              <TextField
                label="Hora de inicio"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                fullWidth
              />
              <TextField
                label="Hora de fin"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                fullWidth
              />
            </Box>
            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddWorkDay}
              >
                Añadir
              </Button>
            </Box>
          </CardContent>
        </Card>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6">Jornadas registradas:</Typography>
        {workDays.map((workDay) => (
          <Box
            key={workDay.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography>
              {workDay.date} - {workDay.project} ({workDay.startTime} -{" "}
              {workDay.endTime})
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDeleteWorkDay(workDay.id)}
            >
              Eliminar
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
