const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkSchedule = sequelize.define('WorkSchedule', {
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
  day_of_week: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '0=Dimanche, 1=Lundi, ..., 6=Samedi'
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  is_working_day: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  shift_name: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Matin, Soir, Nuit, etc.'
  }
}, {
  tableName: 'work_schedules',
  timestamps: true,
  indexes: [
    { fields: ['user_id', 'day_of_week'], unique: true }
  ]
});

module.exports = WorkSchedule;

