import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';

export const Savings = sequelize.define('Savings', {
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
    interest_rate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        field: "interest_rate"
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "description"
    },
    type: {
        type: DataTypes.ENUM('recurrent', 'one-time'),
        allowNull: false,
        field: "type"
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "date"
    },
}, {
    tableName: 'savings',
    timestamps: false, // Desactiva campos createdAt y updatedAt
});

export default Savings;
