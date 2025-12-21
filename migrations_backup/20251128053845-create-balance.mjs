// migrations/20251128053845-create-balance.js
import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.createTable('Balances', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employeeId: {
      type: DataTypes.INTEGER,
      references: { model: 'Employees', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    leaveBalance: { type: DataTypes.INTEGER, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('Balances');
}
