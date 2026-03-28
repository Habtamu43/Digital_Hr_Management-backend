"use strict";

const Attendance = (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    "Attendance",
    {
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Employees", // must match your Employee table
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      status: {
        type: DataTypes.ENUM("Present", "Absent", "Not Specified"),
        allowNull: false,
        defaultValue: "Not Specified",
      },

      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Organizations", // must match your Organization table
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      timestamps: true,
      tableName: "Attendances",
    }
  );

  // Associations
  Attendance.associate = (models) => {
    // Belongs to Employee
    Attendance.belongsTo(models.Employee, {
      foreignKey: "employeeId",
      as: "employee",
    });

    // Belongs to Organization
    Attendance.belongsTo(models.Organization, {
      foreignKey: "organizationId",
      as: "organization",
    });
  };

  return Attendance;
};

export default Attendance;
