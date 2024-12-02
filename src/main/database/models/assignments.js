import { DataTypes } from 'sequelize';
import sequelize from '../connection';
import { Phases } from './phases';
import { Technicians } from './technicians';

export const Assignments = sequelize.define('Assignments', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    field: "id_asignacion",
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
  phase:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Phases,
        key: 'id',
    },
    field: "id_fase",
  },
  hours:{
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "id_fase",
  },
  startDate:{
    type: DataTypes.DATE,
    allowNull: false,
    field: "id_fase",
  },
  endDate:{
    type: DataTypes.DATE,
    allowNull: false,
    field: "id_fase",
  }
}, {
  tableName: 'asignaciones',
  timestamps: false,
});
