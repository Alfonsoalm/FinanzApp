import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';

export const Expenses = sequelize.define('Expenses', {
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
    tableName: 'expenses',
    timestamps: false, // Desactiva campos createdAt y updatedAt
});

export default Expenses;
