const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
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
  site_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Site',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  clock_in: {
    type: DataTypes.DATE,
    allowNull: true
  },
  clock_out: {
    type: DataTypes.DATE,
    allowNull: true
  },
  clock_in_latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  clock_in_longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  clock_out_latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  clock_out_longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  clock_in_photo: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL du selfie d\'entrée'
  },
  clock_out_photo: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL du selfie de sortie'
  },
  total_hours: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  overtime_hours: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  late_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('present', 'late', 'absent', 'justified', 'holiday', 'leave'),
    defaultValue: 'present'
  },
  is_synced: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Pour synchronisation offline'
  },
  synced_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  modified_by: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID du manager qui a modifié le pointage'
  },
  modification_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'attendances',
  timestamps: true,
  indexes: [
    { fields: ['user_id', 'date'], unique: true },
    { fields: ['date'] },
    { fields: ['status'] }
  ]
});

module.exports = Attendance;

