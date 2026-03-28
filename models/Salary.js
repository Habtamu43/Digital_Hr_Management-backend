'use strict';

const Salary = (sequelize, DataTypes) => {
  const Salary = sequelize.define(
    'Salary',
    {
      // Link to Employee
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'employeeId', // exact DB column name
        references: {
          model: 'Employees', // table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      basicPay: {
        type: DataTypes.FLOAT,
        allowNull: false,
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

      // Link to Organization
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Organizations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    },
    {
      tableName: 'Salaries',
      timestamps: true,
    }
  );

  // Associations
  Salary.associate = (models) => {
    // Each salary belongs to an employee
    Salary.belongsTo(models.Employee, {
      foreignKey: 'employeeId', // JS property
      as: 'employee',
    });

    // Each salary belongs to an organization
    Salary.belongsTo(models.Organization, {
      foreignKey: 'organizationId',
      as: 'organization',
    });
  };

  return Salary;
};

export default Salary;
