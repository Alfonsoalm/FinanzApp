import { DataTypes } from 'sequelize';
import sequelize from '../connection';
import { Technicians } from './technicians';

export const Salaries = sequelize.define('Salaries', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    field: "id_salario",
  },
  contributionGroup: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "grupo_cotizacion",
  },
  grossSalary: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    field: "salario_bruto",
  },
  contributionSalary: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    field: "cuota_patronal",
  },
  workLoad: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    field: "porcentaje_jornada",
  },
  startDate:{
    type: DataTypes.DATE,
    allowNull: false,
    field: "fecha_inicio",
  },
  endDate:{
    type: DataTypes.DATE,
    allowNull: true,
    field: "fecha_fin",
  },
  id_technician: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Technicians,
        key: 'id',
    },
    field: "id_tecnico",
  },
}, {
  tableName: 'salarios',
  timestamps: false,
});
