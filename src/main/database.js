import mysql from 'mysql2/promise'; // Usar mysql2 con promesas

const connectionConfig = {
  host: 'localhost',
  database: 'gestion_de_proyectos',
  user: 'IZRA',
  password: 'izra',
};

// Función para autenticar al usuario
export async function authenticateUser(username, password) {
  console.log("AUTENTICACION");
  console.log("Username:", username);

  try {
    // Crear una conexión a la base de datos
    const connection = await mysql.createConnection(connectionConfig);

    // Realizar la consulta para verificar el usuario y la contraseña
    const [results] = await connection.execute(
      'SELECT T.id_tecnico, T.nombre, T.is_admin, CAST(AES_DECRYPT(T.contrasena, ? ) AS CHAR) AS contrasena FROM tecnicos T WHERE T.usuario = ?',
      ["cetemet", username]
    );

    console.log(results)

    // Cerrar la conexión
    await connection.end();

    // Verificar si el usuario existe
    if (results.length > 0) {

      if (password == results[0].contrasena){
        console.log("Usuario logueado")
        return { success: true, user: results[0] };
      }
      console.error("Contraseña incorrecta")
      return { success: false, error: "La contraseña es incorrecta"};
      
    } else {
      console.error("Usuario no existe");
      return { success: false, error: "El usuario no existe" };
    }
  } catch (error) {
    console.error("Error al autenticar al usuario:", error);
    return { success: false, error: "Error de base de datos" };
  }
}