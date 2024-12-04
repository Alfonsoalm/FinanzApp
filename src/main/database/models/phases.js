import { DataTypes } from 'sequelize';
import sequelize from '../connection';
import { Projects } from './projects';

export const Phases = sequelize.define('Phases', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    field: "id_fase",
  },
  project: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Projects,
        key: 'id',
    },
    field: "id_proyecto",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "nombre",
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
  tableName: 'fases',
  timestamps: false,
});
