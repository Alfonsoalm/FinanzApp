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
    field: "horas",
  },
  startDate:{
    type: DataTypes.DATE,
    allowNull: false,
    field: "fecha_inicio",
  },
  endDate:{
    type: DataTypes.DATE,
    allowNull: false,
    field: "fecha_fin",
  }
}, {
  tableName: 'asignaciones',
  timestamps: false,
});
