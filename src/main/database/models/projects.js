import { DataTypes } from 'sequelize';
import sequelize from '../connection';
import { Headquarters } from './headquarters';
import { Calls } from './calls';  // Lo dejas aquí, pero no se establece relación todavía.

export const Projects = sequelize.define('Projects', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement:true,
    primaryKey: true,
    field: "id_proyecto",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "nombre",
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "duracion",
  },
  budget: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    field: "presupuesto",
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "tipo",
  },
  remaining_budget: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    field: "presupuesto_restante",
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "fecha_inicio",
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "fecha_fin",
  },
  headquarter: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Headquarters,
      key: 'id',
    },
    field: "id_sede",
  },
  call: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Calls,
      key: 'id',
    },
    field: "id_convocatoria",
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "estado",
  },
}, {
  tableName: 'proyectos',
  timestamps: false,
});
