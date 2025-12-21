'use strict';

export default{
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Leaves', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      employeeId: { type: Sequelize.INTEGER, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false },
      startDate: { type: Sequelize.DATEONLY, allowNull: false },
      endDate: { type: Sequelize.DATEONLY, allowNull: false },
      status: { type: Sequelize.ENUM('Pending','Approved','Rejected'), defaultValue: 'Pending' },
      organizationId: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Leaves');
  }
};
