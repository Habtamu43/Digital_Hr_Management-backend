'use strict';

export default{
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('InterviewInsights', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      applicantId: { type: Sequelize.INTEGER, allowNull: false },
      interviewerId: { type: Sequelize.INTEGER, allowNull: false },
      feedback: { type: Sequelize.TEXT },
      score: { type: Sequelize.INTEGER },
      organizationId: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('InterviewInsights');
  }
};
