"use strict";

const GenerateRequest = (sequelize, DataTypes) => {
  const GenerateRequest = sequelize.define(
    "GenerateRequest",
    {
      requestTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      requestContent: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Pending", "Approved", "Denied"),
        allowNull: false,
        defaultValue: "Pending",
      },
      employeeId: {
        // lowercase d
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Employees", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      departmentId: {
        // lowercase d
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Departments", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      approvedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "HumanResources", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Organizations", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      timestamps: true,
      tableName: "GenerateRequests",
    },
  );

  // Associatio
  GenerateRequest.associate = (models) => {
    GenerateRequest.belongsTo(models.Employee, {
      foreignKey: "employeeId",
      as: "employee",
    });
    GenerateRequest.belongsTo(models.Department, {
      foreignKey: "departmentId",
      as: "department",
    });
    GenerateRequest.belongsTo(models.HumanResources, {
      foreignKey: "approvedBy",
      as: "approvedByHR",
    });
    GenerateRequest.belongsTo(models.Organization, {
      foreignKey: "organizationId",
      as: "organization",
    });
  };

  return GenerateRequest;
};

export default GenerateRequest;
