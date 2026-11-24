'use strict';

const bcrypt = require('bcryptjs');

const DEMO_PASSWORD = 'RaceUp-demo-2026';
// The Week 10 seeder gave every demo account this fake value.
const PLACEHOLDER = 'demo-not-a-real-hash';

module.exports = {
  async up(queryInterface) {
    const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
    // Only accounts with no real password yet: empty, or still the fake placeholder.
    await queryInterface.sequelize.query(
      'UPDATE users SET password_hash = :hash WHERE password_hash IS NULL OR password_hash = :placeholder',
      { replacements: { hash, placeholder: PLACEHOLDER } }
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      'UPDATE users SET password_hash = :placeholder WHERE school_id LIKE :pattern',
      { replacements: { placeholder: PLACEHOLDER, pattern: '2099-%' } }
    );
  },
};