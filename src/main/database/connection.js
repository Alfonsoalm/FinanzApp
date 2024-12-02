import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('gestion_de_proyectos', 'IZRA', 'izra', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  logging: false, // Deshabilitar el registro de las consultas (opcional)
});

export default sequelize;


