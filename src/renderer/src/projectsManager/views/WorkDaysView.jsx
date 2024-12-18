import { useContext, useState, useEffect } from "react";
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
import dayjs from "dayjs";
import { ProjectManagerContext } from "../context/ProjectsManagerContext";
import { DatePicker } from "@mui/x-date-pickers";

export const WorkDaysView = () => {
  const {
    id: technicianId,
    insertWorkday,
    getWorkdaysByTechnician,
    projects,
    getProjects,
    holidays,
    getHolidays,
    deleteWorkday,
  } = useContext(ProjectManagerContext);

  const [projectId, setProjectId] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("16:00");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [workDays, setWorkDays] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProjects();
        await getHolidays();
        const technicianWorkDays = await getWorkdaysByTechnician(technicianId);
        setWorkDays(technicianWorkDays); // Aseguramos que los datos cargan antes de renderizar
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchData();
  }, [technicianId, getProjects, getHolidays, getWorkdaysByTechnician]);

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

  const isHoliday = (date) => holidays.includes(date.format("YYYY-MM-DD"));
  const isWorkday = (date) =>
    workDays.some((workDay) => workDay.date === date.format("YYYY-MM-DD"));

  const handleAddWorkDay = async () => {
    if (!selectedDate || !projectId || !startTime || !endTime) {
      alert("Por favor, completa todos los campos");
      return;
    }

    if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
      alert("El formato de la hora debe ser HH:mm");
      return;
    }

    const formattedStartTime = dayjs(
      `${selectedDate.format("YYYY-MM-DD")}T${startTime}`
    ).format("HH:mm:ss");
    const formattedEndTime = dayjs(
      `${selectedDate.format("YYYY-MM-DD")}T${endTime}`
    ).format("HH:mm:ss");

    const hours = dayjs(
      `${selectedDate.format("YYYY-MM-DD")}T${endTime}`
    ).diff(dayjs(`${selectedDate.format("YYYY-MM-DD")}T${startTime}`), "hour");

    if (hours <= 0) {
      alert("La hora de fin debe ser mayor a la hora de inicio");
      return;
    }

    const newWorkDay = {
      project: projectId,
      technician: technicianId,
      hours_work: hours,
      date: selectedDate.format("YYYY-MM-DD"),
      startHour: formattedStartTime,
      endHour: formattedEndTime,
    };

    try {
      await insertWorkday(newWorkDay);
      setWorkDays([...workDays, { ...newWorkDay, id_jornada: workDays.length + 1 }]);
      alert("Jornada laboral añadida con éxito");

      setSelectedDate(dayjs());
      setProjectId("");
      setStartTime("08:00");
      setEndTime("16:00");
    } catch (error) {
      console.error("Error al añadir la jornada laboral:", error);
      alert("Hubo un error al añadir la jornada laboral. Intenta nuevamente.");
    }
  };

  const handleDeleteWorkDay = async (id) => {
    try {
      await deleteWorkday(id);
      setWorkDays(workDays.filter((workDay) => workDay.id !== id));
      alert("Jornada eliminada con éxito");
    } catch (error) {
      console.error("Error al eliminar la jornada:", error);
      alert("Hubo un error al eliminar la jornada. Intenta nuevamente.");
    }
  };

  const getProjectName = (id) => {
    const project = projects.find((p) => p.id === id);
    return project ? project.name : "Proyecto desconocido";
  };

  const getSelectedWorkday = () => {
    const selectedWorkday = workDays.find(
      (workDay) => workDay.date === selectedDate.format("YYYY-MM-DD")
    );
    return selectedWorkday || null;
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
        {emptyDays.map((_, index) => (
          <Box key={`empty-${index}`} />
        ))}
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
                : isWorkday(day)
                ? "green"
                : "#fff",
              color: isHoliday(day) || isWorkday(day) ? "#fff" : "#000",
              "&:hover": {
                backgroundColor: isHoliday(day)
                  ? "darkred"
                  : isWorkday(day)
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

  const selectedWorkday = getSelectedWorkday();

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f9f9f9",
        width: "100%",
      }}
    >
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
        <Card sx={{ height: "80%", padding: 2 }}>
          <CardContent>

                        {/* Year and Month Pickers */}
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
              <Typography variant="h6">
                {currentDate.format("MMMM YYYY")}
              </Typography>
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
                height: "500px",
              }}
            >
              {renderCustomCalendar()}
            </Box>
          </CardContent>
        </Card>
      </Box>
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
                value={selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : ""}
                disabled
                fullWidth
              />
              <TextField
                select
                label="Proyecto"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                fullWidth
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
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
              <Button variant="contained" color="primary" onClick={handleAddWorkDay}>
                Añadir
              </Button>
            </Box>
          </CardContent>
        </Card>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6">Jornada seleccionada:</Typography>
        <Card sx={{ height: "auto", padding: 2 }}>
          <CardContent>
            {selectedWorkday ? (
              <Box>
                <Typography>
                  {dayjs(selectedWorkday.date).format("DD/MM/YYYY")} -{" "}
                  {selectedWorkday.startHour} a {selectedWorkday.endHour} -{" "}
                  {selectedWorkday.hours_work} horas -{" "}
                  {getProjectName(selectedWorkday.project)}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={() => handleDeleteWorkDay(selectedWorkday.id)}
                >
                  Eliminar jornada
                </Button>
              </Box>
            ) : (
              <Typography>No hay jornada registrada para esta fecha.</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
