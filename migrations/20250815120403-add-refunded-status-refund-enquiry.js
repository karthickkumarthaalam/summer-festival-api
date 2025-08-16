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
    await queryInterface.addColumn('RefundEnquiries', 'REFUNDED_STATUS', {
      type: Sequelize.ENUM('pending', 'verified', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
      comment: 'Status of the refund enquiry' // 'pending', 'verified', 'refunded'
    });
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
