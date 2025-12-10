const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Holiday = sequelize.define('Holiday', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  company_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Company',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  is_recurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Si vrai, se répète chaque année'
  },
  country: {
    type: DataTypes.STRING(2),
    allowNull: true,
    comment: 'Code pays ISO pour jours fériés nationaux'
  }
}, {
  tableName: 'holidays',
  timestamps: true,
  indexes: [
    { fields: ['date'] },
    { fields: ['company_id', 'date'] }
  ]
});

module.exports = Holiday;

