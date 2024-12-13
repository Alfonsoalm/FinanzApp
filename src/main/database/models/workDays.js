import { DataTypes } from 'sequelize';
import sequelize from '../connection';
import { Technicians } from './technicians';
import { Projects } from './projects';

export const WorkDays = sequelize.define('WorkDays', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement:true, // Añadido
        primaryKey: true,
        field: "id_jornada",
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
    technician: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Technicians,
            key: 'id',
        },
        field: "id_tecnico",
    },
    hours_work: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "horas",
    },
    date:{
        type: DataTypes.DATE,
        allowNull: false,
        field: "fecha",
      },
    startHour: {
        type: DataTypes.TIME,
        allowNull: false,
        field: "hora_entrada",
    },
    endHour: {
        type: DataTypes.TIME,
        allowNull: true,
        field: "hora_salida",
    },
}, {
  tableName: 'jornadas_reales',
  timestamps: false,
});
