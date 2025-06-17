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
    await queryInterface.addColumn('contact_us', "twitter_url", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('contact_us', "spotify_url", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('contact_us', "twitter_url");
    await queryInterface.removeColumn('contact_us', "spotify_url");
  }
};
