'use strict';

const Notice  = (sequelize, DataTypes) => {
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
      type: DataTypes.ENUM('Department-Specific', 'Employee-Specific'),
      allowNull: false,
    },
    departmentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Departments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    employeeID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Employees',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    createdByID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'HumanResources',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    organizationID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Organizations',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  }, {
    timestamps: true,
    tableName: 'Notices',
  });

  // ✅ Associations
  Notice.associate = (models) => {
    Notice.belongsTo(models.Department, {
      foreignKey: 'departmentID',
      as: 'department',
    });

    Notice.belongsTo(models.Employee, {
      foreignKey: 'employeeID',
      as: 'employee',
    });

    Notice.belongsTo(models.HumanResources, {
      foreignKey: 'createdByID',
      as: 'createdBy',
    });

    Notice.belongsTo(models.Organization, {
      foreignKey: 'organizationID',
      as: 'organization',
    });
  };

  return Notice;
};

export default Notice