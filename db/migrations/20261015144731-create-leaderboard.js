'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('leaderboard', {
      entry_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      player_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'players', key: 'player_id' },
        onDelete: 'CASCADE',
      },
      score: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      rank_position: { type: Sequelize.INTEGER, allowNull: false },
      achieved_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.addConstraint('leaderboard', {
      type: 'check',
      name: 'ck_leaderboard_rank_positive',
      fields: ['rank_position'],
      where: { rank_position: { [Sequelize.Op.gt]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('leaderboard');
  },
};