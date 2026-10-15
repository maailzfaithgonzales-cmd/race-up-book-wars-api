'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('game_sessions', {
      session_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      host_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'game_users', key: 'user_id' },
        onDelete: 'RESTRICT',
      },
      set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'question_sets', key: 'set_id' },
        onDelete: 'RESTRICT',
      },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'WAITING' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      started_at: { type: Sequelize.DATE, allowNull: true },
      time_limit_sec: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 30 },
    });

    await queryInterface.addConstraint('game_sessions', {
      type: 'check',
      name: 'ck_sessions_status_valid',
      fields: ['status'],
      where: { status: { [Sequelize.Op.in]: ['WAITING', 'PLAYING', 'ENDED'] } },
    });
    await queryInterface.addConstraint('game_sessions', {
      type: 'check',
      name: 'ck_sessions_time_limit_positive',
      fields: ['time_limit_sec'],
      where: { time_limit_sec: { [Sequelize.Op.gt]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('game_sessions');
  },
};