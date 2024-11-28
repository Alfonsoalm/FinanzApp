import { DataTypes } from 'sequelize';
import sequelize from '../connection';

export const Calls = sequelize.define('Calls', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: "id_convocatoria",
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "tipo",
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "anio",
  },
  limit_cost_time_cp_a: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    field: "limite_coste_hora_cp_a",
  },
  limit_cost_time_cp_b: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    field: "limite_coste_hora_cp_b",
  },
  limit_cost_time_cp_c: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    field: "limite_coste_hora_cp_c",
  },
  infoURL: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "enlace_info_convocatoria",
  },
}, {
  tableName: 'convocatorias',
  timestamps: false,
});
