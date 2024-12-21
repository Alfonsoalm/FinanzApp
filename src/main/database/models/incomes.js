import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';

export const Incomes = sequelize.define('Incomes', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "amount"
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "category"
    },
    type: {
        type: DataTypes.ENUM('recurrent', 'one-time'),
        allowNull: false,
        field: "type"
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "description"
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "date"
    },
}, {
    tableName: 'incomes',
    timestamps: false, // Desactiva campos createdAt y updatedAt
});


export default Incomes;
