const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Template = require('./Template');

const UserTemplateUnlock = sequelize.define('UserTemplateUnlock', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    templateId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Template,
            key: 'id'
        }
    },
    amountPaid: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    paymentMethod: {
        type: DataTypes.STRING,
        defaultValue: 'mock'
    },
    unlockedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// Define relationships
User.hasMany(UserTemplateUnlock, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserTemplateUnlock.belongsTo(User, { foreignKey: 'userId' });

Template.hasMany(UserTemplateUnlock, { foreignKey: 'templateId', onDelete: 'CASCADE' });
UserTemplateUnlock.belongsTo(Template, { foreignKey: 'templateId' });

module.exports = UserTemplateUnlock;
