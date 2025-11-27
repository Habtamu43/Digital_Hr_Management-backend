'use strict';

const Leave = (sequelize,DataTypes) => {
  const Leave = sequelize.define('Leave', {
    employeeID: {
      type: DataTypes.INTEGER,
      allowNull: false, // required: true
      references: {
        model: 'Employees', // must match your Employee table/model
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Leave Application',
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Rejected', 'Approved'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    approvedByID: {
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
    timestamps: true, // adds createdAt and updatedAt
    tableName: 'Leaves', // PostgreSQL prefers plural table names
  });

  // ✅ Associations
  Leave.associate = (models) => {
    // Each leave belongs to one employee
    Leave.belongsTo(models.Employee, {
      foreignKey: 'employeeID',
      as: 'employee',
    });

    // Each leave may be approved by a HumanResources member
    Leave.belongsTo(models.HumanResources, {
      foreignKey: 'approvedByID',
      as: 'approvedBy',
    });

    // Each leave belongs to one organization
    Leave.belongsTo(models.Organization, {
      foreignKey: 'organizationID',
      as: 'organization',
    });
  };

  return Leave;
};

export default Leave;