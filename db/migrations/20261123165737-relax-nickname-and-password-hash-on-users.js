'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // The kit stores a 60-character bcrypt hash, and an account may have no password yet.
    await queryInterface.changeColumn('users', 'password_hash', {
      type: Sequelize.STRING(60),
      allowNull: true,
    });
    // Registration does not ask for a nickname. UNIQUE stays: PostgreSQL allows many NULLs.
    await queryInterface.changeColumn('users', 'nickname', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Fill the empty values first, or NOT NULL cannot be put back.
    await queryInterface.sequelize.query(
      "UPDATE users SET nickname = COALESCE(school_id, 'user_' || user_id) WHERE nickname IS NULL"
    );
    await queryInterface.sequelize.query(
      "UPDATE users SET password_hash = 'no-password-set' WHERE password_hash IS NULL"
    );
    await queryInterface.changeColumn('users', 'nickname', {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
    await queryInterface.changeColumn('users', 'password_hash', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },
};