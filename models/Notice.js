'use strict';

const Notice = (sequelize, DataTypes) => {
  const Notice = sequelize.define('Notice', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    audience: {
      type: DataTypes.ENUM('All', 'Department-Specific', 'Employee-Specific'),
      allowNull: false,
    },

    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "departmentId",
      references: { model: 'Departments', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },

    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "employeeId",
      references: { model: 'Employees', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },

    // ✅ FIXED (IMPORTANT)
    createdById: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "createdByID", // maps to your DB column
      references: { model: 'HumanResources', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },

    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "organizationId",
      references: { model: 'Organizations', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  }, {
    tableName: 'Notices',
    timestamps: true,
  });

  Notice.associate = (models) => {
    Notice.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department',
    });

    Notice.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      as: 'employee',
    });

    // ✅ FIXED (use createdById consistently)
    Notice.belongsTo(models.HumanResources, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    Notice.belongsTo(models.Organization, {
      foreignKey: 'organizationId',
      as: 'organization',
    });
  };

  return Notice;
};

export default Notice;