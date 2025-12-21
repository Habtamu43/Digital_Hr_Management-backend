'use strict';

const Employee = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Invalid email address format, please enter a valid email address',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactnumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('HR-Admin', 'Employee'),
      allowNull: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      field: 'departmentID', // maps to DB column
      references: {
        model: 'Departments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    attendanceId: {
      type: DataTypes.INTEGER,
      field: 'attendanceID', // maps to DB column
      references: {
        model: 'Attendances',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    organizationId: {
      type: DataTypes.INTEGER,
      field: 'organizationID', // maps to DB column
      references: {
        model: 'Organizations',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  }, {
    timestamps: true,
    tableName: 'Employees',
  });

  // Associations
  Employee.associate = (models) => {
    Employee.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department',
    });

    Employee.belongsTo(models.Organization, {
      foreignKey: 'organizationId',
      as: 'organization',
    });

    Employee.belongsTo(models.Attendance, {
      foreignKey: 'attendanceId',
      as: 'attendance',
    });

    Employee.hasMany(models.Notice, {
      foreignKey: 'employeeID',
      as: 'notices',
    });

    Employee.hasMany(models.Salary, {
      foreignKey: 'employeeID',
      as: 'salaries',
    });

    Employee.hasMany(models.Leave, {
      foreignKey: 'employeeID',
      as: 'leaveRequests',
    });

    Employee.hasMany(models.GenerateRequest, {
      foreignKey: 'employeeID',
      as: 'generateRequests',
    });
  };

  return Employee;
};

export default Employee;
