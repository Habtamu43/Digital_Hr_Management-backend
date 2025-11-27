'use strict';

const GenerateRequest = (sequelize,DataTypes) => {
  const GenerateRequest = sequelize.define('GenerateRequest', {
    requestTitle: {
      type: DataTypes.STRING,
      allowNull: false, // same as required: true
    },
    requestContent: {
      type: DataTypes.STRING,
      allowNull: false, // same as required: true
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Denied'),
      allowNull: false,
      defaultValue: 'Pending', // default: 'Pending'
    },
    employeeID: {
      type: DataTypes.INTEGER,
      allowNull: false, // required: true
      references: {
        model: 'Employees', // must match Employee model/table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    departmentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Departments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    approvedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'HumanResources',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
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
    timestamps: true, // same as { timestamps: true } in Mongoose
    tableName: 'GenerateRequests', // ensures consistent naming in PostgreSQL
  });

  // ✅ Associations
  GenerateRequest.associate = (models) => {
    // Each request belongs to one employee
    GenerateRequest.belongsTo(models.Employee, {
      foreignKey: 'employeeID',
      as: 'employee',
    });

    // Each request belongs to one department
    GenerateRequest.belongsTo(models.Department, {
      foreignKey: 'departmentID',
      as: 'department',
    });

    // Each request may be approved by one HR
    GenerateRequest.belongsTo(models.HumanResources, {
      foreignKey: 'approvedBy',
      as: 'approvedByHR',
    });

    // Each request belongs to an organization
    GenerateRequest.belongsTo(models.Organization, {
      foreignKey: 'organizationID',
      as: 'organization',
    });
  };

  return GenerateRequest;
};

export default GenerateRequest 