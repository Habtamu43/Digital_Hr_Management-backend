// migrations/20251128053850-create-interviewinsights.mjs
import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.createTable('InterviewInsights', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    applicantId: {
      type: DataTypes.INTEGER,
      references: { model: 'Applicants', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    feedback: { type: DataTypes.TEXT },
    score: { type: DataTypes.INTEGER },
    interviewDate: { type: DataTypes.DATE },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('InterviewInsights');
}
