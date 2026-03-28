// Example: 20251209020144-add-verification-fields.mjs
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Applicants', 'isVerified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Applicants', 'isVerified');
  },
};
