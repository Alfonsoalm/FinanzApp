import { DataTypes } from 'sequelize';
import sequelize from '../connection';

export const Headquarters = sequelize.define('Headquarters', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: "id_sede",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "nombre",
  },
}, {
  tableName: 'sedes',
  timestamps: false,
});
