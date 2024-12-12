import { useContext, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  TextField,
  Grid2,
} from "@mui/material";
import { DateCalendar, DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { ProjectManagerContext } from "../context/ProjectsManagerContext";

export const VacationView = () => {
  const { id, insertVacation, getVacations, getHolidays, vacations, holidays } = useContext(ProjectManagerContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date());

  const totalVacationDays = 30;
  const usedVacationDays = vacations?.length || 0;
  const remainingVacationDays = totalVacationDays - usedVacationDays;

  const handleVacationRequest = async () => {
    if (!selectedDate) {
      alert("Por favor, selecciona una fecha para las vacaciones.");
      return;
    }

    const vacation = {
      technician:id, // ID del técnico
      date: selectedDate, // Fecha seleccionada
      status: "pendiente", // Estado inicial
    };
    await insertVacation(vacation); // Llama a la función del contexto para insertar la vacación
    alert("Vacación solicitada con éxito.");
    getVacations(); // Refresca la lista de vacaciones
    getHolidays();
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
    if (vacations.some((workDay) => workDay.date === formattedDay)) {
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
        overflow: "hidden",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Column for Calendar */}
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
        <Card sx={{ height: "100%", padding: 2 }}>
          <CardContent>
            {/* Vacation Numbers */}
            <Grid2 container spacing={2} sx={{ mb: 3 }}>
              <Grid2 item xs={4}>
                <Typography variant="h6" align="center">
                  Total: {totalVacationDays} días
                </Typography>
              </Grid2>
              <Grid2 item xs={4}>
                <Typography variant="h6" align="center">
                  Tomados: {usedVacationDays} días
                </Typography>
              </Grid2>
              <Grid2 item xs={4}>
                <Typography variant="h6" align="center">
                  Restantes: {remainingVacationDays} días
                </Typography>
              </Grid2>
            </Grid2>

            <Divider sx={{ mb: 3 }} />

            {/* Year and Month Selection */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={["year"]}
                  label="Año"
                  value={new Date(year, 0)}
                  onChange={(newValue) => setYear(newValue.getFullYear())}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={["month"]}
                  label="Mes"
                  value={month}
                  onChange={(newValue) => setMonth(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>

            {/* Calendar */}
            <Box
              sx={{
                flexGrow: 1,
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f5f5f5",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "calc(100vh - 300px)",
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
          </CardContent>
        </Card>
      </Box>

      {/* Sidebar for Vacation Request Form */}
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
          Solicitar Vacaciones
        </Typography>
        <Card sx={{ height: "100%", padding: 2 }}>
          <CardContent>
            {/* Form for Selecting Date Range */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <DatePicker
                label="Fecha"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleVacationRequest}
                startIcon={<CalendarMonthOutlinedIcon />}
              >
                Solicitar Vacaciones
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
