'use strict';

export default{
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Attendances', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      employeeId: { type: Sequelize.INTEGER, allowNull: false },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      status: { type: Sequelize.STRING, allowNull: false },
      organizationId: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Attendances');
  }
};
