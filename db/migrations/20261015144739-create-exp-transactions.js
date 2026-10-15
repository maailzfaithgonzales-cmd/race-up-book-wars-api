'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exp_transactions', {
      transaction_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'game_users', key: 'user_id' },
        onDelete: 'RESTRICT',
      },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'game_sessions', key: 'session_id' },
        onDelete: 'RESTRICT',
      },
      host_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'game_users', key: 'user_id' },
        onDelete: 'RESTRICT',
      },
      exp_amount: { type: Sequelize.INTEGER, allowNull: false },
      awarded_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.addConstraint('exp_transactions', {
      type: 'check',
      name: 'ck_exp_amount_positive',
      fields: ['exp_amount'],
      where: { exp_amount: { [Sequelize.Op.gt]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('exp_transactions');
  },
};