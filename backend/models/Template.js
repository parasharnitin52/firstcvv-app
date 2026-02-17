const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Template = sequelize.define('Template', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    atsScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 90
    },
    thumbnail: {
        type: DataTypes.STRING, // URL or path
        allowNull: true
    },
    structure: {
        type: DataTypes.JSONB, // Stores layout config, sections enabled, etc.
        defaultValue: {}
    },
    isLocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        defaultValue: 50,
        allowNull: false
    }
});

module.exports = Template;
