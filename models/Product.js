const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    category: {
        type: DataTypes.STRING,
    },
    discount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    mrp: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    addedBy: {
        type: DataTypes.INTEGER, // Stores User ID of the admin/user who added it
        allowNull: true,
    }
}, {
    timestamps: true,
});

module.exports = Product;
