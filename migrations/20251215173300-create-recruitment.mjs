'use strict';

export default{
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Recruitments', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      applicantId: { type: Sequelize.INTEGER, allowNull: false },
      status: { type: Sequelize.ENUM('Pending','Interview-Scheduled','Interview-Completed','Hired','Rejected'), defaultValue: 'Pending' },
      organizationId: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Recruitments');
  }
};
