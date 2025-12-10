const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeaveType = sequelize.define('LeaveType', {
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
    type: DataTypes.STRING(100),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  color: {
    type: DataTypes.STRING(7),
    defaultValue: '#10B981',
    comment: 'Couleur hex pour le calendrier'
  },
  is_paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  requires_approval: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  requires_document: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  max_days_per_year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'leave_types',
  timestamps: true
});

module.exports = LeaveType;

