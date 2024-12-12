import { useContext, useEffect, useState } from "react";
import { ProjectManagerContext } from "../context/ProjectsManagerContext";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx"; // Importar librería XLSX
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid2,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    IconButton,
} from "@mui/material";
import { Visibility as EditIcon, Delete as DeleteIcon, FileDownload as ExportIcon } from "@mui/icons-material";

export const TechnicianDetailsView = () => {
    const { "*": id } = useParams();
    const { technicians, getSalariesByTechnician, getAssignmentsByTechnician, insertSalary, deleteSalary, editSalary } = useContext(ProjectManagerContext);

    const [technician, setTechnician] = useState([]);
    const [details, setDetails] = useState({
        name: "",
        role: "",
        wage_reductions: "",
        headquarter: "",
        hours_work: "",
        join_date: "",
        nationalId: "",
        username: "",
        is_active: false,
        is_admin: false,
        salaries: [],
    });

    const [assignments, setAssignments] = useState([]); // Asignaciones
    const [newSalary, setNewSalary] = useState({
        contributionGroup: "",
        hourCost: "",
        startDate: "",
        endDate: "",
    });

    const [editingSalary, setEditingSalary] = useState(null); // Estado para el salario que se está editando
    const [showSalariesSection, setShowSalariesSection] = useState(false); // Mostrar sección de salarios
    const [showCostsSection, setShowCostsSection] = useState(false); // Mostrar sección de costos

    const fetchDetails = async () => {
        const salaries = await getSalariesByTechnician(id);
        setDetails((prevDetails) => ({
            ...prevDetails,
            salaries: salaries,
        }));
    };

    const fetchAssignments = async () => {
        const assignments = await getAssignmentsByTechnician(id);
        setAssignments(assignments);
    };

    useEffect(() => {
        if (technicians && id) {
            const technicianFound = technicians.find((tech) => String(tech.id) === String(id));
            setTechnician(technicianFound);
            setDetails({
                ...technicianFound,
                salaries: [],
            });
            fetchDetails();
            fetchAssignments();
        }
    }, [technicians, id]);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(details.salaries);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Salarios");
        XLSX.writeFile(workbook, "salarios.xlsx");
    };

    return (
        technician && (
            <Box sx={{ p: 3, width: "100%" }}>
                {/* Nombre del Técnico */}
                <Typography variant="h4" sx={{ mb: 2 }}>
                    {details.name}
                </Typography>

                {/* Sección Datos del Técnico */}
                <Card sx={{ mb: 3, border: "1px solid green" }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                            Datos del Técnico:
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid2 container spacing={2}>
                            <Grid2 item xs={12} sm={6}>
                                <Typography>
                                    <strong>Puesto:</strong> {details.role}
                                </Typography>
                            </Grid2>
                            <Grid2 item xs={12} sm={6}>
                                <Typography>
                                    <strong>Sede:</strong> {details.headquarter}
                                </Typography>
                            </Grid2>
                            <Grid2 item xs={12} sm={6}>
                                <Typography>
                                    <strong>Fecha de Incorporación:</strong> {new Date(details.join_date).toLocaleDateString()}
                                </Typography>
                            </Grid2>
                            <Grid2 item xs={12} sm={6}>
                                <Typography>
                                    <strong>DNI:</strong> {details.nationalId}
                                </Typography>
                            </Grid2>
                        </Grid2>
                    </CardContent>
                </Card>

                {/* Botones para mostrar secciones */}
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setShowSalariesSection(!showSalariesSection)}
                    >
                        {showSalariesSection ? "Ocultar Salarios" : "Modificar Salarios"}
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setShowCostsSection(!showCostsSection)}
                    >
                        {showCostsSection ? "Ocultar Costos" : "Ver Tabla de Costos"}
                    </Button>
                </Box>

                {/* Sección Salario */}
                {showSalariesSection && (
                    <Card sx={{ mb: 3, border: "1px solid green" }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                            Salario:
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Grupo Cotización</strong></TableCell>
                                    <TableCell><strong>Coste Hora (€)</strong></TableCell>
                                    <TableCell><strong>Fecha Inicio</strong></TableCell>
                                    <TableCell><strong>Fecha Fin</strong></TableCell>
                                    <TableCell><strong>Acciones</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {details.salaries && details.salaries.length > 0 ? (
                                    details.salaries.map((salary) => (
                                        <TableRow key={salary.id}>
                                            {editingSalary && editingSalary.id === salary.id ? (
                                                <>
                                                    <TableCell>
                                                        <TextField
                                                            name="contributionGroup"
                                                            value={editingSalary.contributionGroup}
                                                            onChange={handleEditInputChange}
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            name="hourCost"
                                                            type="number"
                                                            value={editingSalary.hourCost}
                                                            onChange={handleEditInputChange}
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            name="startDate"
                                                            type="date"
                                                            value={editingSalary.startDate}
                                                            onChange={handleEditInputChange}
                                                            InputLabelProps={{ shrink: true }}
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            name="endDate"
                                                            type="date"
                                                            value={editingSalary.endDate || ""}
                                                            onChange={handleEditInputChange}
                                                            InputLabelProps={{ shrink: true }}
                                                            fullWidth
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleSaveEditedSalary}
                                                        >
                                                            Guardar
                                                        </Button>
                                                        <Button
                                                            variant="text"
                                                            color="secondary"
                                                            onClick={handleCancelEdit}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    </TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell>{salary.contributionGroup}</TableCell>
                                                    <TableCell>{salary.hourCost}</TableCell>
                                                    <TableCell>{salary.startDate}</TableCell>
                                                    <TableCell>{salary.endDate || "N/A"}</TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => handleEditSalary(salary)}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            color="secondary"
                                                            onClick={() => handleDeleteSalary(salary.id)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <Typography variant="body1" color="textSecondary">
                                                No hay salarios disponibles para este técnico.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        {/* Formulario para agregar salario */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Agregar Salario
                            </Typography>
                            <Grid2 container spacing={2}>
                                <Grid2 item xs={12} sm={3}>
                                    <TextField
                                        label="Grupo Cotización"
                                        name="contributionGroup"
                                        value={newSalary.contributionGroup}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                </Grid2>
                                <Grid2 item xs={12} sm={3}>
                                    <TextField
                                        label="Coste Hora (€)"
                                        name="hourCost"
                                        type="number"
                                        value={newSalary.hourCost}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                </Grid2>
                                <Grid2 item xs={12} sm={3}>
                                    <TextField
                                        label="Fecha Inicio"
                                        name="startDate"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        value={newSalary.startDate}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                </Grid2>
                                <Grid2 item xs={12} sm={3}>
                                    <TextField
                                        label="Fecha Fin"
                                        name="endDate"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        value={newSalary.endDate}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                </Grid2>
                                <Grid2 item xs={12}>
                                    <Button variant="contained" color="primary" onClick={handleSaveSalary}>
                                        Guardar Salario
                                    </Button>
                                </Grid2>
                            </Grid2>
                        </Box>
                    </CardContent>
                </Card>
                )}

                {/* Sección Asignaciones */}
                {showCostsSection && (
                    <Card sx={{ mb: 3, border: "1px solid blue" }}>
                        <CardContent>
                            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                                Tabla de Costos:
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Fase</strong></TableCell>
                                        <TableCell><strong>Horas</strong></TableCell>
                                        <TableCell><strong>Fecha Inicio</strong></TableCell>
                                        <TableCell><strong>Fecha Fin</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {assignments.length > 0 ? (
                                        assignments.map((assignment, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{assignment.fase}</TableCell>
                                                <TableCell>{assignment.horas}</TableCell>
                                                <TableCell>{assignment.fecha_inicio}</TableCell>
                                                <TableCell>{assignment.fecha_fin}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4}>
                                                <Typography variant="body1" color="textSecondary">
                                                    No hay asignaciones disponibles para este técnico.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </Box>
        )
    );
};
