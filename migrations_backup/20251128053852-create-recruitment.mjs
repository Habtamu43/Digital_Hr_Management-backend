// migrations/20251128053852-create-recruitment.mjs
import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.createTable('Recruitments', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    position: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('Open', 'Closed'), defaultValue: 'Open' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('Recruitments');
}
