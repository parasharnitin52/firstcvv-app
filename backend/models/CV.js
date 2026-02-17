const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const CV = sequelize.define('CV', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  templateId: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'modern'
  },
  personalInfo: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  experience: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  education: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  skills: {
    type: DataTypes.JSONB,
    defaultValue: {
      technical: [],
      soft: [],
      languages: []
    }
  },
  projects: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  certifications: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  customSections: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
});

// Define relationships
User.hasMany(CV, { foreignKey: 'userId', onDelete: 'CASCADE' });
CV.belongsTo(User, { foreignKey: 'userId' });

module.exports = CV;
