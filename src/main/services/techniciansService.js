import { TechnicianRepository } from '../database/repositories';


export async function authenticateUser(username, password) {
  
  try {
    const user = await TechnicianRepository.findByUsername(username);

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



export function handleTechnicians(ipcMain) {
    ipcMain.handle('login', async (event, { username, password }) => {
      try {   
        return await authenticateUser(username, password); // Llamada a la base de datos
        
      } catch (error) {
        console.error('Error in handleTechnicians:', error); 
        return { success: false, error: 'Error en la autenticación' };
      }
    });
}