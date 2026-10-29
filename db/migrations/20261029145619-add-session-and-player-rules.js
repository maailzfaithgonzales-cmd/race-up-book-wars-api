'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('game_sessions', 'max_players', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 30,
    });

    await queryInterface.addConstraint('game_sessions', {
      type: 'check',
      name: 'ck_sessions_max_players_positive',
      fields: ['max_players'],
      where: { max_players: { [Sequelize.Op.gt]: 0 } },
    });

    await queryInterface.addConstraint('players', {
      type: 'unique',
      name: 'uq_player_nickname',
      fields: ['session_id', 'nickname'],
    });

    await queryInterface.changeColumn('players', 'player_token_hash', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn('players', 'token_expires_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "UPDATE players SET player_token_hash = 'none' WHERE player_token_hash IS NULL"
    );

    await queryInterface.sequelize.query(
      'UPDATE players SET token_expires_at = now() WHERE token_expires_at IS NULL'
    );

    await queryInterface.changeColumn('players', 'token_expires_at', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.changeColumn('players', 'player_token_hash', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    await queryInterface.removeConstraint('players', 'uq_player_nickname');
    await queryInterface.removeConstraint(
      'game_sessions',
      'ck_sessions_max_players_positive'
    );
    await queryInterface.removeColumn('game_sessions', 'max_players');
  },
};
