'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('player_question_progress', {
      progress_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      player_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'players', key: 'player_id' },
        onDelete: 'CASCADE',
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'questions', key: 'question_id' },
        onDelete: 'CASCADE',
      },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'PENDING' },
      attempts: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      completed_at: { type: Sequelize.DATE, allowNull: true },
    });

    await queryInterface.addConstraint('player_question_progress', {
      type: 'unique',
      name: 'uq_one_progress_per_player_question',
      fields: ['player_id', 'question_id'],
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('player_question_progress');
  },
};