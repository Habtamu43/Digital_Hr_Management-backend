'use strict';

const Department = (sequelize,DataTypes) => {
  const Department = sequelize.define('Department', {
    name: {
      type: DataTypes.STRING,
      allowNull: false, // same as required: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false, // same as required: true
    },
    organizationID: {
      type: DataTypes.INTEGER, // foreign key reference to Organization table
      references: {
        model: 'Organizations', // table name (should match your Organization model)
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  }, {
    timestamps: true, // adds createdAt & updatedAt automatically
    tableName: 'Departments', // optional explicit table name
  });

  // ✅ Associations
  Department.associate = (models) => {
    // Department belongs to one Organization
    Department.belongsTo(models.Organization, {
      foreignKey: 'organizationID',
      as: 'organization',
    });

    // Department has many Employees
    Department.hasMany(models.Employee, {
      foreignKey: 'departmentID',
      as: 'employees',
    });

    // Department has many HumanResources
    Department.hasMany(models.HumanResources, {
      foreignKey: 'departmentID',
      as: 'humanResources',
    });

    // Department has many Notices
    Department.hasMany(models.Notice, {
      foreignKey: 'departmentID',
      as: 'notices',
    });
  };

  return Department;
};

export default Department 