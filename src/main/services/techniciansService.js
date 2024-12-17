import { TechnicianRepository } from '../database/repositories';
import { AssignmentsRepository } from '../database/repositories/AssignmentsRepository';


async function authenticateUser(username, password) {
  try {
    const user = await TechnicianRepository.findByUsername(username);
    console(user)
    if (!user) {
      // Si el usuario no se encuentra, devolver un error
      return { success: false, error: 'Usuario no encontrado' };
    }
    // Comparar la contraseña
    if (password === user.password) {
      return { success: true, data: user };
    } else {
      return { success: false, error: 'Contraseña incorrecta' };
    }
  }catch(error){
    console.error('Error in authenticateUser:', error); 
    return { success: false, error: 'Error en la autenticación' };
  }
}


async function getTechnicians(){
  try{
    const technicians = await TechnicianRepository.getAll()
    return {success: true, data: technicians};
  }catch(error){
    console.error('Error in getTechnicians:', error); 
    return {success: false, error: "Error al cargar los tecnicos"}
  }  
}

async function insertTechnician(technician){
  try{
    await TechnicianRepository.insert(technician)
    return {success: true};
  }catch(error){
    console.error('Error in insertTechnician:', error); 
    return {success: false, error: "Error al insertar el nuevo tecnico"}
  }
}

async function deleteTechnician(id_technician) {
  try{
    await TechnicianRepository.deleteById(id_technician)
    return {success: true};

  }catch(error){
    console.error('Error in deleteProject:', error); 
    return {success: false, error: "Error al borrar el tecnico"}
  }
}

async function deleteSoftTechnician(id_technician) {
  try{
    // ############################################
    // MODIFICAR PARA SEPARA LOGICA EN EL SERVICIO
    // ############################################
    await TechnicianRepository.deleteSoftById(id_technician)
    return {success: true};

  }catch(error){
    console.error('Error in deleteSoftById:', error); 
    return {success: false, error: "Error al borrar suave el tecnico"}
  }
}

async function getTechnicianDetails(id_technician) {
  try {
    // Obtiene los datos del tecnico
    const technician = await TechnicianRepository.findById(id_technician);
    
    if (technician) {
      return { success: true, data: technician }; // Éxito: devolver los datos del técnico
    }
    return { success: false, error: 'Técnico no encontrado' };
  } catch (error) {
    console.error('Error al obtener detalles del técnico:', error);
    return { success: false, error: 'Error interno del servidor.' };
  }
}

async function getTechnicianAssignments(id_technician) {
  try {
    // Obtiene los datos del tecnico

    const assignments = await AssignmentsRepository.getAssignments(id_technician);
    
    if (assignments) {
      return { success: true, data: assignments }; // Éxito: devolver los datos del técnico
    }
    return { success: false, error: 'Asignaciones no encontradas' };
  } catch (error) {
    console.error('Error al obtener asignaciones del técnico:', error);
    return { success: false, error: 'Error interno del servidor.' };
  }
}

export function handleTechnicians(ipcMain) {
    ipcMain.handle('login', async (event, { username, password }) => {
      try {   
        return await authenticateUser(username, password); // Llamada a la base de datos
      } catch (error) {
        console.error('Error in handleTechnicians:', error); 
        return { success: false, error: 'Error en la autenticación' };
      }
    });

    ipcMain.handle('get-technicians', async () => {
      try {   
        return await getTechnicians(); // Llamada a la base de datos
      } catch (error) {
        console.error('Error in get-technicians:', error); 
        return { success: false, error: 'Error en la autenticación' };
      }
    });

    ipcMain.handle('insert-technician', async (event, technician) => {
      try {   
        return await insertTechnician(technician); // Llamada a la base de datos
      } catch (error) {
        console.error('Error in insert-technician:', error); 
        return { success: false, error: 'Error en la autenticación' };
      }
    });

    ipcMain.handle('delete-technician', async (event, id_technician) => {
      try {
        return await deleteTechnician(id_technician); 
      } catch (error) {
        console.error('Error in deleteTechnician:', error); 
        return { success: false, error: "No se pudo eliminar el tecnico" };
      }
    });

    ipcMain.handle('delete-soft-technician', async (event, id_technician) => {
      try {
        return await deleteSoftTechnician(id_technician); 
      } catch (error) {
        console.error('Error in deleteSoftTechnician:', error); 
        return { success: false, error: "No se pudo eliminar suave el tecnico" };
      }
    });

    ipcMain.handle('get-technician-details', async (event, id_technician) => {
      try {
        console.log("get-technician-details")
        return await getTechnicianDetails(id_technician); 
      } catch (error) {
        console.error('Error in getTechnicianDetails:', error); 
        return { success: false, error: "No se pudo obtener los detalles del tecnico" };
      }
    });

    ipcMain.handle('get-technician-assignments', async (event, id_technician) => {
      try {
        console.log("get-technician-assignments")
        return await getTechnicianAssignments(id_technician); 
      } catch (error) {
        console.error('Error in getAssignments:', error); 
        return { success: false, error: "No se pudo obtener las asignaciones del tecnico" };
      }
    });
}