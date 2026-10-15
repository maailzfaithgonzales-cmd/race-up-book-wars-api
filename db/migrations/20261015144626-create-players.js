'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('players', {
      player_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'game_sessions', key: 'session_id' },
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'game_users', key: 'user_id' },
        onDelete: 'RESTRICT',
      },
      nickname: { type: Sequelize.STRING(50), allowNull: false },
      player_token_hash: { type: Sequelize.STRING(255), allowNull: false },
      token_expires_at: { type: Sequelize.DATE, allowNull: false },
      shelf_position: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      ranking: { type: Sequelize.INTEGER, allowNull: true },
      session_output: { type: Sequelize.JSON, allowNull: true },
      joined_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.addConstraint('players', {
      type: 'unique',
      name: 'uq_one_seat',
      fields: ['session_id', 'user_id'],
    });
    await queryInterface.addConstraint('players', {
      type: 'check',
      name: 'ck_players_shelf_not_negative',
      fields: ['shelf_position'],
      where: { shelf_position: { [Sequelize.Op.gte]: 0 } },
    });
    await queryInterface.addConstraint('players', {
      type: 'check',
      name: 'ck_players_ranking_positive',
      fields: ['ranking'],
      where: { ranking: { [Sequelize.Op.gt]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('players');
  },
};