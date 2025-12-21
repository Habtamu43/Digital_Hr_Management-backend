'use strict';

export default{
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GenerateRequests', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      employeeId: { type: Sequelize.INTEGER, allowNull: false },
      requestType: { type: Sequelize.STRING, allowNull: false },
      status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'pending' },
      organizationId: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('GenerateRequests');
  }
};
