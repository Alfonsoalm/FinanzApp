import { TechnicianRepository } from '../database/repositories';


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

export function handleTechnicians(ipcMain) {
  
    ipcMain.handle('login', async (event, { username, password }) => {
      try {   
        return await authenticateUser(username, password); // Llamada a la base de datos
      } catch (error) {
        console.error('Error in handleTechnicians:', error); 
        return { success: false, error: 'Error en la autenticación' };
      }
    });

    ipcMain.handle('get-technicians', async (event) => {
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

    ipcMain.handle('get-technician-details', async (event, id_technician) => {
      try {
        return await getTechnicianDetails(id_technician); 
      } catch (error) {
        console.error('Error in getAssignments:', error); 
        return { success: false, error: "No se pudo obtener las asignaciones" };
      }
    });
}