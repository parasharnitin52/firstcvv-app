const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Skill = sequelize.define('Skill', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    category: {
        type: DataTypes.ENUM('Technical', 'Soft', 'Language', 'Tool'),
        defaultValue: 'Technical'
    },
    relatedDegrees: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [] // e.g. ['Computer Science', 'Information Technology']
    }
});

module.exports = Skill;
