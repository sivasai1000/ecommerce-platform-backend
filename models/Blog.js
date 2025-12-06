const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Blog = sequelize.define('Blog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        defaultValue: 'Admin',
    },
    category: {
        type: DataTypes.STRING,
    },
    imageUrl: {
        type: DataTypes.STRING,
    },
    tags: {
        type: DataTypes.STRING, // Storing as comma-separated string for simplicity
    },
}, {
    timestamps: true,
});

module.exports = Blog;
