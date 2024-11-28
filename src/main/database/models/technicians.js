import { DataTypes } from 'sequelize';
import sequelize from '../connection';
import { Calls } from './calls';

export const Technicians = sequelize.define('Technicians', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: "id_tecnico",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "nombre",
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "puesto",
  },
  wage_reductions: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    field: "disminuciones_salariales",
  },
  call: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Calls,
      key: 'id',
    },
    field: "id_sede",
  },
  hours_work: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "horas_jornada",
  },
  join_date: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "fecha_incorporacion",
  },
  nationalId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "dni",
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "usuario",
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "contrasena",
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: "is_active",
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: "is_admin",
  },
}, {
  tableName: 'tecnicos',
  timestamps: false,
});
