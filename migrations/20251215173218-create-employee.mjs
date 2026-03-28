'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Employees', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      firstname: { type: Sequelize.STRING, allowNull: false },
      lastname: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      phone: { type: Sequelize.STRING, allowNull: true },
      departmentId: { type: Sequelize.INTEGER, allowNull: false },
      organizationId: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Employees');
  }
};
