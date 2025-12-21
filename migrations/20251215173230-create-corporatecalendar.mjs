'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CorporateCalendars', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      event: { type: Sequelize.STRING, allowNull: false },
      date: { type: Sequelize.DATE, allowNull: false },
      organizationId: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('CorporateCalendars');
  }
};
