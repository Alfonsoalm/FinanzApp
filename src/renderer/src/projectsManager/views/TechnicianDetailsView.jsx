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

    const [newSalary, setNewSalary] = useState({
        contributionGroup: "",
        hourCost: "",
        startDate: "",
        endDate: "",
    });

    const [editingSalary, setEditingSalary] = useState(null); // Estado para el salario que se está editando
    const [showSalariesSection, setShowSalariesSection] = useState(false); // Mostrar sección de salarios
    const [showCostsSection, setShowCostsSection] = useState(false); // Mostrar sección de costos
    const [assignments, setAssignments] = useState([]); // Asignaciones

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSalary({
            ...newSalary,
            [name]: value,
        });
    };

    const handleSaveSalary = async () => {
        if (!newSalary.contributionGroup || !newSalary.hourCost || !newSalary.startDate) {
            alert("Por favor, rellena todos los campos obligatorios.");
            return;
        }

        await insertSalary({
            ...newSalary,
            id_technician: id, // Asegúrate de enviar el ID del técnico
        });

        fetchDetails(); // Refresca la lista de salarios
        setNewSalary({ contributionGroup: "", hourCost: "", startDate: "", endDate: "" }); // Limpia el formulario
    };

    const handleDeleteSalary = async (salaryId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este salario?")) {
            try {
                await deleteSalary(salaryId);
                fetchDetails(); // Refresca la lista de salarios
            } catch (error) {
                console.error("Error al eliminar el salario:", error);
                alert("Hubo un error al eliminar el salario. Por favor, inténtalo de nuevo.");
            }
        }
    };

    const handleEditSalary = (salary) => {
        setEditingSalary({ ...salary }); // Copia los datos del salario a editar en el estado
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingSalary({
            ...editingSalary,
            [name]: value,
        });
    };

    const handleSaveEditedSalary = async () => {
        try {
            await editSalary({ ...editingSalary }); // Actualiza el salario
            fetchDetails(); // Refresca la lista de salarios
            setEditingSalary(null); // Limpia el modo de edición
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
            alert("Hubo un error al guardar los cambios. Por favor, inténtalo de nuevo.");
        }
    };

    const handleCancelEdit = () => {
        setEditingSalary(null); // Cancela el modo de edición
    };

    const exportAssignmentsToExcel = () => {
        const formattedAssignments = assignments.map((assignment) => ({
            Fase: assignment.Phase.dataValues.name,
            Horas: assignment.hours,
            "Fecha Inicio": assignment.startDate,
            "Fecha Fin": assignment.endDate,
        }));
        const worksheet = XLSX.utils.json_to_sheet(formattedAssignments);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Asignaciones");
        XLSX.writeFile(workbook, "asignaciones.xlsx");
    };

    const exportSalariesToExcel = () => {
        const formattedSalaries = details.salaries.map((salary) => ({
            "Grupo Cotización": salary.contributionGroup,
            "Coste Hora (€)": salary.hourCost,
            "Fecha Inicio": salary.startDate,
            "Fecha Fin": salary.endDate || "N/A",
        }));
        const worksheet = XLSX.utils.json_to_sheet(formattedSalaries);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Salarios");
        XLSX.writeFile(workbook, "salarios.xlsx");
    };


    return (
        technician && (
            <Box
    sx={{
        height: "100vh", // Ocupa toda la ventana del navegador
        overflowY: "auto", // Scroll vertical
        overflowX: "hidden", // Oculta el scroll horizontal globalmente
        padding: 2, // Espaciado opcional
    }}
>
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
                            <Grid2  xs={12} sm={6}>
                                <Typography>
                                    <strong>Puesto:</strong> {details.role}
                                </Typography>
                            </Grid2>
                            <Grid2  xs={12} sm={6}>
                                <Typography>
                                    <strong>Sede:</strong> {details.headquarter}
                                </Typography>
                            </Grid2>
                            <Grid2  xs={12} sm={6}>
                                <Typography>
                                    <strong>Fecha de Incorporación:</strong> {new Date(details.join_date).toLocaleDateString()}
                                </Typography>
                            </Grid2>
                            <Grid2  xs={12} sm={6}>
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
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<ExportIcon />}
                            onClick={exportSalariesToExcel}
                            sx={{ mb: 2 }}>
                            Exportar Salarios a Excel
                        </Button>
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
                                                    <TableCell>{salary.contributionGroup.toString()}</TableCell>
                                                    <TableCell>{salary.hourCost.toString()}</TableCell>
                                                    <TableCell>{salary.startDate.toString()}</TableCell>
                                                    <TableCell>{salary.endDate.toString() || "N/A"}</TableCell>
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
                                <Grid2  xs={12} sm={3}>
                                    <TextField
                                        label="Grupo Cotización"
                                        name="contributionGroup"
                                        value={newSalary.contributionGroup}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                </Grid2>
                                <Grid2  xs={12} sm={3}>
                                    <TextField
                                        label="Coste Hora (€)"
                                        name="hourCost"
                                        type="number"
                                        value={newSalary.hourCost}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                </Grid2>
                                <Grid2  xs={12} sm={3}>
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
                                <Grid2  xs={12} sm={3}>
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
                                <Grid2  xs={12}>
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
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<ExportIcon />}
                                onClick={exportAssignmentsToExcel}
                                sx={{ mb: 2 }}
>
                                Exportar Asignaciones a Excel
                            </Button>
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
                                    {assignments ? (
                                        assignments.map((assignment, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{assignment.Phase.dataValues.name.toString()}</TableCell>
                                                <TableCell>{assignment.hours.toString()}</TableCell>
                                                <TableCell>{assignment.startDate.toString()}</TableCell>
                                                <TableCell>{assignment.endDate.toString()}</TableCell>
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
