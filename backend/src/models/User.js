const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
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
  site_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Site',
      key: 'id'
    }
  },
  department_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Department',
      key: 'id'
    }
  },
  manager_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  employee_code: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  pin_code: {
    type: DataTypes.STRING(6),
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('super_admin', 'admin', 'manager', 'employee', 'accountant'),
    defaultValue: 'employee',
    allowNull: false
  },
  job_title: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  contract_type: {
    type: DataTypes.ENUM('cdi', 'cdd', 'daily', 'intern', 'freelance'),
    defaultValue: 'cdi'
  },
  avatar_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  leave_balance: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Solde de congés en jours'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  device_tokens: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Tokens pour notifications push'
  },
  settings: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Préférences utilisateur'
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
      if (user.pin_code) {
        user.pin_code = await bcrypt.hash(user.pin_code, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
      if (user.changed('pin_code')) {
        user.pin_code = await bcrypt.hash(user.pin_code, 10);
      }
    }
  }
});

// Méthodes d'instance
User.prototype.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.comparePinCode = async function(candidatePinCode) {
  if (!this.pin_code) return false;
  return bcrypt.compare(candidatePinCode, this.pin_code);
};

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  delete values.pin_code;
  return values;
};

module.exports = User;

