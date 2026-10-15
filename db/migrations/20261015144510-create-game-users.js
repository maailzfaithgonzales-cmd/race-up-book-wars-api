'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('game_users', {
      user_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nickname: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      role: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'PLAYER' },
      total_exp: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.addConstraint('game_users', {
      type: 'check',
      name: 'ck_game_users_role_valid',
      fields: ['role'],
      where: { role: { [Sequelize.Op.in]: ['PLAYER', 'HOST'] } },
    });
    await queryInterface.addConstraint('game_users', {
      type: 'check',
      name: 'ck_game_users_exp_not_negative',
      fields: ['total_exp'],
      where: { total_exp: { [Sequelize.Op.gte]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('game_users');
  },
};