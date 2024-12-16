import { DataTypes } from 'sequelize';
import sequelize from '../connection';
import { Technicians } from './technicians';

export const Vacation = sequelize.define('Vacation', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement:true,
    primaryKey: true,
    field: "id_vacaciones_tecnicos",
  },
  technician: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
        model: Technicians,
        key: 'id',
    },
    field: "id_tecnico",
  },
  date:{
    type: DataTypes.DATE,
    allowNull: false,
    field: "fecha",
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "estado",
  }
}, {
  tableName: 'vacaciones_tecnicos',
  timestamps: false,
});
