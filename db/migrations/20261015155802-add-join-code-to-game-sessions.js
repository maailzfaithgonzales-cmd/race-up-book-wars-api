'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('game_sessions', 'join_code', {
      type: Sequelize.STRING(6),
      allowNull: false,
      unique: true,
    });
    await queryInterface.sequelize.query(
      "ALTER TABLE game_sessions ADD CONSTRAINT ck_sessions_join_code_six_digits CHECK (join_code ~ '^[0-9]{6}$')"
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('game_sessions', 'join_code');
  },
};