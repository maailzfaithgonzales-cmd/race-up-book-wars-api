'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Swap the old rule (PLAYER, HOST) for one that also allows ADMIN.
    await queryInterface.removeConstraint('users', 'ck_game_users_role_valid');
    await queryInterface.addConstraint('users', {
      type: 'check',
      name: 'ck_users_role_valid',
      fields: ['role'],
      where: { role: { [Sequelize.Op.in]: ['PLAYER', 'HOST', 'ADMIN'] } },
    });
  },

  async down(queryInterface, Sequelize) {
    // The old rule would reject ADMIN rows, so turn them into PLAYERs first.
    await queryInterface.sequelize.query("UPDATE users SET role = 'PLAYER' WHERE role = 'ADMIN'");
    await queryInterface.removeConstraint('users', 'ck_users_role_valid');
    await queryInterface.addConstraint('users', {
      type: 'check',
      name: 'ck_game_users_role_valid',
      fields: ['role'],
      where: { role: { [Sequelize.Op.in]: ['PLAYER', 'HOST'] } },
    });
  },
};