'use strict';

const Department = (sequelize, DataTypes) => {
  const Department = sequelize.define(
    'Department',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false, // required field
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false, // required field
      },
      organizationId: {
        type: DataTypes.INTEGER, // foreign key reference to Organization table
        allowNull: true,
        references: {
          model: 'Organizations', // table name must match Organization model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    },
    {
      timestamps: true, // adds createdAt & updatedAt automatically
      tableName: 'Departments', // explicit table name
    }
  );

  // ✅ Associations
  Department.associate = (models) => {
    // Department belongs to one Organization
    Department.belongsTo(models.Organization, {
      foreignKey: 'organizationId',
      as: 'organization',
    });

    // Department has many Employees
    Department.hasMany(models.Employee, {
      foreignKey: 'departmentId', // updated to camelCase
      as: 'employees',
    });

    // Department has many HumanResources
    Department.hasMany(models.HumanResources, {
      foreignKey: 'departmentId', // updated to camelCase
      as: 'humanResources',
    });

    // Department has many Notices
    Department.hasMany(models.Notice, {
      foreignKey: 'departmentId', // updated to camelCase
      as: 'notices',
    });
  };

  return Department;
};

export default Department;

