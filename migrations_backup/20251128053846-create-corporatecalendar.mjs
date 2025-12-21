// migrations/20251128053846-create-corporatecalendar.js
import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.createTable('CorporateCalendars', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    description: { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('CorporateCalendars');
}
