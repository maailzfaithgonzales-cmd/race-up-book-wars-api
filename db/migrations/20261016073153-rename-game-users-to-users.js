'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.renameTable('game_users', 'users');
  },

  async down(queryInterface) {
    await queryInterface.renameTable('users', 'game_users');
  },
};