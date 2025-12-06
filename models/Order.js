const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        defaultValue: 'pending',
    },
    paymentId: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true,
});

module.exports = Order;
