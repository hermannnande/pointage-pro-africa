const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Justification = sequelize.define('Justification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  attendance_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Attendance',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('late', 'absent', 'early_leave', 'other'),
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'URLs des pièces jointes (certificats médicaux, etc.)'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  reviewed_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  reviewed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  review_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'justifications',
  timestamps: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['status'] }
  ]
});

module.exports = Justification;

