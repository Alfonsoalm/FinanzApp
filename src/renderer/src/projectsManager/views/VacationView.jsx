import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { ProjectManagerContext } from "../context/ProjectsManagerContext";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

export const VacationView = () => {
  const {
    id,
    insertVacation,
    getVacationsByTechnician,
    getVacations,
    getHolidays,
    holidays,
  } = useContext(ProjectManagerContext);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [vacations, setVacations] = useState([]);
  const [numberVac, setNumberVac] = useState(0);
  const [currentDate, setCurrentDate] = useState(dayjs());

  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const technicianId = id || 1; // Replace with the actual technician ID
        const data = await getVacationsByTechnician(technicianId);
        setVacations(data);
        setNumberVac(data.length);
      } catch (error) {
        console.error("Error fetching vacations:", error);
      }
    };
    fetchVacations();
  }, [getVacationsByTechnician, id]);

  const totalVacationDays = 30;
  const usedVacationDays = numberVac || 0;
  const remainingVacationDays = totalVacationDays - usedVacationDays;

  const handleVacationRequest = async () => {
    if (!selectedDate) {
      alert("Por favor, selecciona una fecha para las vacaciones.");
      return;
    }

    const vacation = {
      technician: id,
      date: selectedDate.format("YYYY-MM-DD"),
      status: "pendiente",
    };

    try {
      await insertVacation(vacation);
      alert("Vacación solicitada con éxito.");
      getVacations();
      getHolidays();
    } catch (error) {
      console.error("Error al solicitar la vacación:", error);
      alert("Hubo un problema al solicitar la vacación. Inténtalo de nuevo.");
    }
  };

  const isHoliday = (date) => holidays.includes(date.format("YYYY-MM-DD"));
  const isVacation = (date) =>
    vacations.some((vacation) => vacation.date === date.format("YYYY-MM-DD"));

  const handlePreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  const handleYearChange = (newYear) => {
    if (newYear) {
      setCurrentDate(currentDate.year(newYear.year()));
    }
  };

  const handleMonthChange = (newMonth) => {
    if (newMonth) {
      setCurrentDate(currentDate.month(newMonth.month()));
    }
  };

  const renderCustomCalendar = () => {
    const daysInMonth = currentDate.daysInMonth();
    const days = Array.from({ length: daysInMonth }, (_, i) =>
      currentDate.date(i + 1)
    );

    const firstDayOfWeek = currentDate.startOf("month").day();
    const emptyDays = Array.from({ length: firstDayOfWeek }, () => null);

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "10px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        {/* Headers for Days of the Week */}
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <Typography
            key={day}
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              paddingBottom: "10px",
            }}
          >
            {day}
          </Typography>
        ))}
        {/* Empty Slots for Days Before the First of the Month */}
        {emptyDays.map((_, index) => (
          <Box key={`empty-${index}`} />
        ))}
        {/* Days in the Month */}
        {days.map((day) => (
          <Box
            key={day.format("YYYY-MM-DD")}
            onClick={() => setSelectedDate(day)}
            sx={{
              padding: "20px",
              textAlign: "center",
              borderRadius: "4px",
              cursor: "pointer",
              border:
              selectedDate.format("YYYY-MM-DD") === day.format("YYYY-MM-DD")
                ? "2px solid red"
                : "2px solid transparent",
              backgroundColor: isHoliday(day)
                ? "red"
                : isVacation(day)
                ? "blue"
                : "#fff",
              color: isHoliday(day) || isVacation(day) ? "#fff" : "#000",
              "&:hover": {
                backgroundColor: isHoliday(day)
                  ? "darkred"
                  : isVacation(day)
                  ? "darkblue"
                  : "#ddd",
              },
            }}
          >
            {day.date()}
          </Box>
        ))}
      </Box>
    );
  };

  return (
  <Box
    sx={{
      display: "flex",
      height: "100vh",
      backgroundColor: "#f9f9f9",
    }}
  >
    {/* Panel izquierdo */}
    <Box
      sx={{
        flex: 7,
        display: "flex",
        flexDirection: "column",
        padding: 3,
        backgroundColor: "#ffffff",
        borderRight: "1px solid #ddd",
        overflow: "auto", // Desplazamiento si es necesario
      }}
    >
      <Card sx={{ width: "100%", height: "100%", padding: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <DatePicker
              views={["year"]}
              label="Año"
              value={currentDate}
              onChange={handleYearChange}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              views={["month"]}
              label="Mes"
              value={currentDate}
              onChange={handleMonthChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Button variant="outlined" onClick={handlePreviousMonth}>
              Anterior
            </Button>
            <Typography variant="h6">{currentDate.format("MMMM YYYY")}</Typography>
            <Button variant="outlined" onClick={handleNextMonth}>
              Siguiente
            </Button>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#f5f5f5",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              overflow: "auto", // Desplazamiento si el calendario excede
              height: "500px",
            }}
          >
            {renderCustomCalendar()}
          </Box>
        </CardContent>
      </Card>
    </Box>
      
    {/* Panel derecho */}
    <Box
      sx={{
        flex: 3,
        display: "flex",
        flexDirection: "column",
        padding: 3,
        backgroundColor: "#ffffff",
        overflow: "auto", // Desplazamiento si es necesario
      }}
  >
      <Typography variant="h5" sx={{ mb: 3 }}>
        Solicitar Vacaciones
      </Typography>
      <Card sx={{ height: "auto", padding: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Fecha seleccionada"
              value={
                selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : ""
              }
              disabled
              fullWidth
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleVacationRequest}
            >
              Solicitar Vacaciones
            </Button>
          </Box>
          
        </CardContent>
      </Card>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2, // Espaciado entre tarjetas
          alignItems: "center",
        }}>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2, // Espaciado entre tarjetas
          alignItems: "center",
          mt: 5,
        }}
      >
        <Card
          sx={{
            display: "flex",
            alignItems: "center",
            padding: 1,
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <CalendarTodayIcon sx={{ color: "#000" }} />
            Total: {totalVacationDays} días
          </Typography>
        </Card>
        <Card
          sx={{
            display: "flex",
            alignItems: "center",
            padding: 1,
            backgroundColor: "#e3f2fd",
            borderRadius: "8px",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <CheckCircleIcon sx={{ color: "#1976d2" }} />
            Tomados: {usedVacationDays} días
          </Typography>
        </Card>
        <Card
          sx={{
            display: "flex",
            alignItems: "center",
            padding: 1,
            backgroundColor: "#e8f5e9",
            borderRadius: "8px",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <HourglassEmptyIcon sx={{ color: "#388e3c" }} />
            Restantes: {remainingVacationDays} días
          </Typography>
        </Card>
      </Box>


    </Box>
  </Box>

  );
};
