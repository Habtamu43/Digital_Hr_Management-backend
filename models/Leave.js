'use strict';

const Leave = (sequelize, DataTypes) => {
  const Leave = sequelize.define('Leave', {
    employeeId: { // changed from employeeID → employeeId
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Employees',
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
    approvedById: { // changed from approvedByID → approvedById
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'HumanResources',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    organizationId: { // changed from organizationID → organizationId
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
    tableName: 'Leaves',
  });

  // ✅ Associations
  Leave.associate = (models) => {
    Leave.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
      as: 'employee',
    });

    Leave.belongsTo(models.HumanResources, {
      foreignKey: 'approvedById',
      as: 'approvedBy',
    });

    Leave.belongsTo(models.Organization, {
      foreignKey: 'organizationId',
      as: 'organization',
    });
  };

  return Leave;
};

export default Leave;
