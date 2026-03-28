'use strict';

export default{
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Applicants', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      firstname: { type: Sequelize.STRING, allowNull: false },
      lastname: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      contactnumber: { type: Sequelize.STRING, allowNull: false },
      appliedrole: { type: Sequelize.STRING, allowNull: false },
      recruitmentstatus: {
        type: Sequelize.ENUM('pending','Interview-Scheduled','Interview-Completed','Hired','Rejected'),
        defaultValue: 'pending'
      },
      organizationId: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Applicants');
  }
};
