// migrations/20251128053845-create-attendance.js
import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.createTable('Attendances', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employeeId: {
      type: DataTypes.INTEGER,
      references: { model: 'Employees', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    status: { type: DataTypes.ENUM('Present', 'Absent', 'Leave'), defaultValue: 'Present' },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('Attendances');
}
