'use strict';

const Employee = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "Employee",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
      },
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
        validate: { isEmail: true },
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
        type: DataTypes.ENUM("HR-Admin", "Employee"),
        allowNull: false,
        defaultValue: "Employee",
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      /* ===================== FOREIGN KEYS ===================== */
      // IMPORTANT: Ensure these match your actual Database column names
      departmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "departmentId", 
      },
      attendanceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "attendanceId",
      },
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "organizationId",
      },
    },
    {
      tableName: "Employees",
      timestamps: true,
    }
  );

  /* ===================== ASSOCIATIONS ===================== */
  Employee.associate = (models) => {
    Employee.belongsTo(models.Department, {
      foreignKey: "departmentId",
      as: "department",
    });

    Employee.belongsTo(models.Attendance, {
      foreignKey: "attendanceId",
      as: "attendance",
    });

    Employee.belongsTo(models.Organization, {
      foreignKey: "organizationId",
      as: "organization",
    });

    Employee.hasMany(models.Notice, {
      foreignKey: "employeeId",
      as: "notices",
    });

    Employee.hasMany(models.Salary, {
      foreignKey: "employeeId",
      as: "salaries",
    });

    Employee.hasMany(models.Leave, {
      foreignKey: "employeeId",
      as: "leaveRequests",
    });

    Employee.hasMany(models.GenerateRequest, {
      foreignKey: "employeeId",
      as: "generateRequests",
    });
  };

  return Employee;
};

export default Employee;