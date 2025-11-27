'use strict';

const Employee = (sequelize,DataTypes) => {
  const Employee = sequelize.define('Employee', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false, // required: true
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
      defaultValue: DataTypes.NOW, // same as default: Date.now
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
    departmentID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Departments', // references Department table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    attendanceID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Attendances',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    organizationID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Organizations',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  }, {
    timestamps: true, // adds createdAt & updatedAt automatically
    tableName: 'Employees', // optional, ensures consistent table name
  });

  // ✅ Associations
  Employee.associate = (models) => {
    // Belongs to a department
    Employee.belongsTo(models.Department, {
      foreignKey: 'departmentID',
      as: 'department',
    });

    // Belongs to one organization
    Employee.belongsTo(models.Organization, {
      foreignKey: 'organizationID',
      as: 'organization',
    });

    // Belongs to attendance
    Employee.belongsTo(models.Attendance, {
      foreignKey: 'attendanceID',
      as: 'attendance',
    });

    // Has many notices
    Employee.hasMany(models.Notice, {
      foreignKey: 'employeeID',
      as: 'notices',
    });

    // Has many salaries
    Employee.hasMany(models.Salary, {
      foreignKey: 'employeeID',
      as: 'salaries',
    });

    // Has many leave requests
    Employee.hasMany(models.Leave, {
      foreignKey: 'employeeID',
      as: 'leaveRequests',
    });

    // Has many generate requests
    Employee.hasMany(models.GenerateRequest, {
      foreignKey: 'employeeID',
      as: 'generateRequests',
    });
  };

  return Employee;
};

export default Employee