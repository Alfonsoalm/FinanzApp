import { DataTypes } from 'sequelize';
import sequelize from '../connection';
import { Headquarters } from './headquarters';

export const Holidays = sequelize.define('Holidays', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement:true,
        primaryKey: true,
        field: "id_festivo",
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
    date:{
        type: DataTypes.DATE,
        allowNull: false,
        field: "fecha",
    },
}, {
  tableName: 'festivos',
  timestamps: false,
});
