'use strict';

const Salary = (sequelize,DataTypes) => {
  const Salary = sequelize.define('Salary', {
    employeeID: {
      type: DataTypes.INTEGER,
      allowNull: false, // required: true
      references: {
        model: 'Employees', // name of the Employee table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },

    basicPay: {
      type: DataTypes.FLOAT,
      allowNull: false, // required: true
    },

    bonuses: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    deductions: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    netPay: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isFutureDate(value) {
          if (new Date(value) < new Date()) {
            throw new Error('Due date must be in the future');
          }
        },
      },
    },

    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM('Pending', 'Delayed', 'Paid'),
      allowNull: false,
      defaultValue: 'Pending',
    },

    organizationID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Organizations',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  },
  {
    timestamps: true,
    tableName: 'Salaries',
  });

  // ✅ Associations
  Salary.associate = (models) => {
    // One salary record belongs to an employee
    Salary.belongsTo(models.Employee, {
      foreignKey: 'employeeID',
      as: 'employee',
    });

    // One salary record belongs to an organization
    Salary.belongsTo(models.Organization, {
      foreignKey: 'organizationID',
      as: 'organization',
    });
  };

  return Salary;
};

export default Salary