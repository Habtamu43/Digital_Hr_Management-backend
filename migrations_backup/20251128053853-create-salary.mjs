// migrations/20251128053853-create-salary.mjs
import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.createTable('Salaries', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employeeId: {
      type: DataTypes.INTEGER,
      references: { model: 'Employees', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    basic: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    bonus: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    deductions: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('Salaries');
}
