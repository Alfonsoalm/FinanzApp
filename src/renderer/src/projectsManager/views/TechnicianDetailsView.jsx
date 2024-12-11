import { useContext, useEffect, useState } from "react";
import { ProjectManagerContext } from "../context/ProjectsManagerContext";
import { useParams } from "react-router-dom";
import { Box, Button, Card, CardContent, Divider, Grid2, Typography, Table, TableBody, TableCell, TableHead, TableRow, TextField, IconButton } from "@mui/material";
import { Visibility as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

export const TechnicianDetailsView = () => {
    const { "*": id } = useParams();
    const { technicians, getSalariesByTechnician, insertSalary, deleteSalary, editSalary } = useContext(ProjectManagerContext);
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
        salaries: []
    });

    const [newSalary, setNewSalary] = useState({
        contributionGroup: "",
        hourCost: "",
        startDate: "",
        endDate: ""
    });

    const [editingSalary, setEditingSalary] = useState(null); // Estado para el salario que se está editando

    const fetchDetails = async () => {
        const salaries = await getSalariesByTechnician(id);
        setDetails((prevDetails) => ({
            ...prevDetails,
            salaries: salaries
        }));
    };

    useEffect(() => {
        if (technicians && id) {
            const technicianFound = technicians.find((tech) => String(tech.id) === String(id));
            setTechnician(technicianFound);
            setDetails({
                ...technicianFound,
                salaries: []
            });
            fetchDetails();
        }
    }, [technicians, id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSalary({
            ...newSalary,
            [name]: value
        });
    };

    const handleSaveSalary = async () => {
        if (!newSalary.contributionGroup || !newSalary.hourCost || !newSalary.startDate) {
            alert("Por favor, rellena todos los campos obligatorios.");
            return;
        }

        await insertSalary({
            ...newSalary,
            id_technician: id // Asegúrate de enviar el ID del técnico
        });

        fetchDetails(); // Refresca la lista de salarios
        console.log("newSalary:",newSalary);
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
        console.log("editingSalary",editingSalary);
        console.log(name, value);
        setEditingSalary({
            ...editingSalary,
            [name]: value
        });
    };

    const handleSaveEditedSalary = async () => {
        try {
            console.log("editingSalary",editingSalary);
            await editSalary({ ...editingSalary}); // Actualiza el salario (puedes usar otra función si tienes una específica)
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
                                <Typography><strong>Puesto:</strong> {details.role}</Typography>
                            </Grid2>
                            <Grid2 item xs={12} sm={6}>
                                <Typography><strong>Sede:</strong> {details.headquarter}</Typography>
                            </Grid2>
                            <Grid2 item xs={12} sm={6}>
                                <Typography><strong>Fecha de Incorporación:</strong> {new Date(details.join_date).toLocaleDateString()}</Typography>
                            </Grid2>
                            <Grid2 item xs={12} sm={6}>
                                <Typography><strong>DNI:</strong> {details.nationalId}</Typography>
                            </Grid2>
                        </Grid2>
                    </CardContent>
                </Card>

                {/* Sección Salario */}
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
            </Box>
        )
    );
};
