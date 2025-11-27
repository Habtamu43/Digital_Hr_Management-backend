'use strict';

const Balance = (sequelize,DataTypes) => {
  const Balance = sequelize.define('Balance', {
    title: {
      type: DataTypes.STRING,
      allowNull: false, // required
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    availableAmount: {
      type: DataTypes.FLOAT, // or DECIMAL(10,2) for currency precision
      allowNull: false,
    },
    totalExpenses: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    expenseMonth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    submitDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
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
    createdByID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'HumanResources',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  }, {
    timestamps: true,
    tableName: 'Balances',
  });

  // ✅ Associations
  Balance.associate = (models) => {
    Balance.belongsTo(models.Organization, {
      foreignKey: 'organizationID',
      as: 'organization',
    });

    Balance.belongsTo(models.HumanResources, {
      foreignKey: 'createdByID',
      as: 'createdBy',
    });
  };

  return Balance;
};

export default Balance