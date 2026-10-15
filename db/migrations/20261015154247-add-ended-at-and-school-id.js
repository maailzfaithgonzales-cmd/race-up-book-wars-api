'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('game_sessions', 'ended_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('game_users', 'school_id', {
      type: Sequelize.STRING(20),
      allowNull: true,
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('game_users', 'school_id');
    await queryInterface.removeColumn('game_sessions', 'ended_at');
  },
};