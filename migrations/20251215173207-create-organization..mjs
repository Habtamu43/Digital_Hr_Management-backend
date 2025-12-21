'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Organizations', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      address: { type: Sequelize.STRING, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Organizations');
  }
};
