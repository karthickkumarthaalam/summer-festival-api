'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const table = await queryInterface.describeTable('RefundEnquiries');
    if (!table.REFUNDED_STATUS) {
      await queryInterface.addColumn('RefundEnquiries', 'REFUNDED_STATUS', {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('RefundEnquiries', 'REFUNDED_STATUS');
  }
};
