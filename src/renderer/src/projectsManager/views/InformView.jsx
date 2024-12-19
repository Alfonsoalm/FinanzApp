import React, { useContext, useEffect, useState } from "react";
import * as XLSX from "xlsx"; // Importar biblioteca para exportar Excel
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  TableContainer, 
  Paper, 
  Collapse, 
  IconButton, 
  Button 
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { ProjectManagerContext } from "../context/ProjectsManagerContext";

export const InformView = () => {
  const { getPhases, phases, isLoading, error } = useContext(ProjectManagerContext);
  const [groupedData, setGroupedData] = useState([]);
  const [openRows, setOpenRows] = useState({});

  const calculateDurationInMonths = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return (diffDays / 30).toFixed(2);
  };

  useEffect(() => {
    const fetchPhases = async () => {
      await getPhases();
    };
    fetchPhases();
  }, []);

  useEffect(() => {
    const grouped = phases.reduce((acc, phase) => {
      const durationInMonths = calculateDurationInMonths(phase.startDate, phase.endDate);
      if (!acc[phase.project]) {
        acc[phase.project] = [];
      }
      acc[phase.project].push({ ...phase, durationInMonths });
      return acc;
    }, {});
    setGroupedData(Object.entries(grouped));
  }, [phases]);

  const handleToggle = (project) => {
    setOpenRows((prev) => ({ ...prev, [project]: !prev[project] }));
  };

  const exportToExcel = () => {
    const dataToExport = [];

    groupedData.forEach(([project, phases]) => {
      dataToExport.push({ Proyecto: project, Fase: "", Horas: "", Duración: "" });
      phases.forEach((phase) => {
        dataToExport.push({
          Proyecto: "",
          Fase: phase.name,
          Horas: phase.hours,
          Duración: phase.durationInMonths,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport, { skipHeader: true });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Informe");
    XLSX.writeFile(workbook, "informe_fases.xlsx");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh", padding: 4 }}>
      <Box sx={{ textAlign: "left", mb: 3 }}>
        <Typography variant="h4">Informes</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <Button variant="contained" color="primary" onClick={exportToExcel}>
          Exportar a Excel
        </Button>
      </Box>
      {isLoading ? (
        <Typography>Cargando fases...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: "70vh", overflow: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "40%", textAlign: "left" }}>Proyecto/Fase</TableCell>
                <TableCell sx={{ width: "15%", textAlign: "right" }}>Horas</TableCell>
                <TableCell sx={{ width: "20%", textAlign: "right" }}>Duración (Meses)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedData.map(([project, phases]) => (
                <React.Fragment key={project}>
                  <TableRow>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleToggle(project)}>
                        {openRows[project] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                      {project}
                    </TableCell>
                    <TableCell colSpan={3}></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} style={{ padding: 0 }}>
                      <Collapse in={openRows[project]} timeout="auto" unmountOnExit>
                        <Table size="small">
                          <TableBody>
                            {phases.map((phase) => (
                              <TableRow key={phase.id}>
                                <TableCell sx={{ width: "40%", textAlign: "left" }}>{phase.name}</TableCell>
                                <TableCell sx={{ width: "15%", textAlign: "right" }}>{phase.hours}</TableCell>
                                <TableCell sx={{ width: "20%", textAlign: "right" }}>{phase.durationInMonths}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
