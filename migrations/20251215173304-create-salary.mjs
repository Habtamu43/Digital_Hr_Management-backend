'use strict';

export default{
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Salaries', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      employeeId: { type: Sequelize.INTEGER, allowNull: false },
      amount: { type: Sequelize.FLOAT, allowNull: false },
      payDate: { type: Sequelize.DATEONLY },
      organizationId: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Salaries');
  }
};
