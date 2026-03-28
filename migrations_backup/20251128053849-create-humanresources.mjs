// migrations/20251128053849-create-humanresources.js
import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.createTable('HumanResources', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employeeId: {
      type: DataTypes.INTEGER,
      references: { model: 'Employees', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    department: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('HumanResources');
}
