'use strict';

export default{
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Balances', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      employeeId: { type: Sequelize.INTEGER, allowNull: false },
      balanceType: { type: Sequelize.STRING, allowNull: false },
      amount: { type: Sequelize.FLOAT, allowNull: false },
      organizationId: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Balances');
  }
};
