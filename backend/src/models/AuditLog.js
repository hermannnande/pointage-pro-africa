const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  company_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Company',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'User',
      key: 'id'
    },
    comment: 'Utilisateur qui a effectué l\'action'
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'create, update, delete, login, etc.'
  },
  entity_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'User, Attendance, Leave, etc.'
  },
  entity_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  changes: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Détails des modifications'
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'audit_logs',
  timestamps: true,
  updatedAt: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['entity_type', 'entity_id'] },
    { fields: ['created_at'] }
  ]
});

module.exports = AuditLog;

