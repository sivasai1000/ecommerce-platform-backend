const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define('Coupon', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    discountType: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        defaultValue: 'percentage',
    },
    value: { // Percentage amount or Fixed amount
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    expiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    minOrderValue: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    timestamps: true,
});

module.exports = Coupon;
