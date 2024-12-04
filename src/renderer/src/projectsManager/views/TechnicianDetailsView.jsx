import { useContext, useEffect, useState } from "react"
import { ProjectManagerContext } from "../context/ProjectsManagerContext"
import { useParams } from "react-router-dom"
import { Box, Button, Card, CardContent, Divider, Grid2, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";


export const TechnicianDetailsView = () => {
    const { "*": id } = useParams();
    const {technicians, getTechnicianDetails} = useContext(ProjectManagerContext)
    const [technician, setTechnician] = useState(null)
    const [details, setDetails] = useState({
        name: [],
        role: [],
        wage_reductions: [],
        headquarter: [],
        hours_work: [],
        join_date: [],
        nationalId: [],
        username: [],
        password: [],
        is_active: [],
        is_admin: [],
    })

    const fetchDetails = async () => {
        const data = await getTechnicianDetails(id)
        setDetails({
            name: data.name,
            role: data.role,
            wage_reductions: data.wage_reductions,
            headquarter: data.headquarter,
            hours_work: data.hours_work,
            join_date: data.join_date,
            nationalId: data.nationalId,
            username: data.username,
            password: data.password,
            is_active: data.is_active,
            is_admin: data.is_admin,
        })
    }

    useEffect(() => {
        console.log("TechnicianDetailsView");
        if (technicians && id) {
            const technicianFound = technicians.find(tech => String(tech.id) === String(id)); // Busca el proyecto por ID
            setTechnician(technicianFound);
            fetchDetails();
        }

    }, [technicians, id]); 
    
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
                        <Button variant="contained" color="primary" sx={{ mb: 2 }}>
                            Modificar Salario
                        </Button>
                        {/* Tabla de Salario */}
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Categoría</strong></TableCell>
                                    <TableCell><strong>Año</strong></TableCell>
                                    <TableCell><strong>Coste Bruto</strong></TableCell>
                                    <TableCell><strong>Cálculo % Jornada</strong></TableCell>
                                    <TableCell><strong>Coste Horario</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Simulación de datos */}
                                {[2023, 2024, 2025].map((year, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{details.role}</TableCell>
                                        <TableCell>{year}</TableCell>
                                        <TableCell>{details.wage_reductions}€</TableCell>
                                        <TableCell>100%</TableCell>
                                        <TableCell>{(details.wage_reductions / 12).toFixed(2)}€</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Box>
        )
    );
}
