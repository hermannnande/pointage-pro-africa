const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  logo_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(2),
    defaultValue: 'CI',
    comment: 'Code pays ISO (CI = Côte d\'Ivoire)'
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'XOF',
    comment: 'Code devise ISO'
  },
  timezone: {
    type: DataTypes.STRING(50),
    defaultValue: 'Africa/Abidjan'
  },
  settings: {
    type: DataTypes.JSONB,
    defaultValue: {
      late_tolerance_minutes: 10,
      gps_tolerance_meters: 100,
      require_selfie: true,
      auto_clock_out: false,
      working_hours_per_week: 40,
      overtime_rate: 1.5
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  subscription_plan: {
    type: DataTypes.ENUM('free', 'starter', 'professional', 'enterprise'),
    defaultValue: 'free'
  },
  subscription_expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'companies',
  timestamps: true
});

module.exports = Company;

