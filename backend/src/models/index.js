const sequelize = require('../config/database');

// Importer tous les modèles
const User = require('./User');
const Company = require('./Company');
const Site = require('./Site');
const Department = require('./Department');
const Attendance = require('./Attendance');
const Leave = require('./Leave');
const LeaveType = require('./LeaveType');
const WorkSchedule = require('./WorkSchedule');
const Holiday = require('./Holiday');
const AuditLog = require('./AuditLog');
const Justification = require('./Justification');

// Définir les associations

// Company relations
Company.hasMany(User, { foreignKey: 'company_id', as: 'users' });
Company.hasMany(Site, { foreignKey: 'company_id', as: 'sites' });
Company.hasMany(LeaveType, { foreignKey: 'company_id', as: 'leaveTypes' });
Company.hasMany(Holiday, { foreignKey: 'company_id', as: 'holidays' });

// User relations
User.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
User.belongsTo(Site, { foreignKey: 'site_id', as: 'site' });
User.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
User.belongsTo(User, { foreignKey: 'manager_id', as: 'manager' });
User.hasMany(User, { foreignKey: 'manager_id', as: 'team' });
User.hasMany(Attendance, { foreignKey: 'user_id', as: 'attendances' });
User.hasMany(Leave, { foreignKey: 'user_id', as: 'leaves' });
User.hasMany(Justification, { foreignKey: 'user_id', as: 'justifications' });

// Site relations
Site.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
Site.hasMany(User, { foreignKey: 'site_id', as: 'users' });
Site.hasMany(Department, { foreignKey: 'site_id', as: 'departments' });

// Department relations
Department.belongsTo(Site, { foreignKey: 'site_id', as: 'site' });
Department.hasMany(User, { foreignKey: 'department_id', as: 'users' });

// Attendance relations
Attendance.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Attendance.belongsTo(Site, { foreignKey: 'site_id', as: 'site' });
Attendance.hasOne(Justification, { foreignKey: 'attendance_id', as: 'justification' });

// Leave relations
Leave.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Leave.belongsTo(LeaveType, { foreignKey: 'leave_type_id', as: 'leaveType' });
Leave.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });

// LeaveType relations
LeaveType.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
LeaveType.hasMany(Leave, { foreignKey: 'leave_type_id', as: 'leaves' });

// WorkSchedule relations
WorkSchedule.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Holiday relations
Holiday.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// Justification relations
Justification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Justification.belongsTo(Attendance, { foreignKey: 'attendance_id', as: 'attendance' });
Justification.belongsTo(User, { foreignKey: 'reviewed_by', as: 'reviewer' });

// AuditLog relations
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
AuditLog.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// Exporter tous les modèles et la connexion
module.exports = {
  sequelize,
  User,
  Company,
  Site,
  Department,
  Attendance,
  Leave,
  LeaveType,
  WorkSchedule,
  Holiday,
  AuditLog,
  Justification
};

