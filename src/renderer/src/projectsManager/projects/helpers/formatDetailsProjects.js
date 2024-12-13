import dayjs from "dayjs";

export const formatDetailsProjects = ({phases, technicians, assignments}) => {
    const transformedData = phases.map(phase => {
        // Filtrar las asignaciones asociadas a la fase actual
        const relatedAssignments = assignments.filter(assignment => assignment.phase === phase.id);
        
        // Obtener los nombres de los técnicos asociados a estas asignaciones
        const techniciansNames = relatedAssignments.map(assignment => {
            const technician = technicians.find(tech => tech.id === assignment.technician);
            return technician ? technician.name : null;
        }).filter(name => name !== null);
    
        // Obtener las horas de las asignaciones
        const techniciansHours = relatedAssignments.map(assignment => assignment.hours);

        const techniciansIds = relatedAssignments.map(assignment => assignment.technician);
    
        // Devolver la fase transformada
        return {
            ...phase,
            startDate: dayjs(phase.startDate).format('YYYY-MM-DD'),
            endDate: dayjs(phase.endDate).format('YYYY-MM-DD'),
            technicians: techniciansNames,
            techniciansIds: techniciansIds,
            assignmentHours: techniciansHours,
            hours_assigned: techniciansHours.reduce((accumulator, currentValue) => accumulator + currentValue, 0),
            isNew: false, 
        };
    });

    return transformedData;
}
