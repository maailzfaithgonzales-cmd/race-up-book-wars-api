'use strict';

const bcrypt = require('bcryptjs');

const DEMO_PASSWORD = 'RaceUp-demo-2026';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [{
      nickname: 'admin_demo',
      school_id: '2099-0008',
      full_name: 'Aida Demo Admin',
      email: 'aida@demo.test',
      role: 'ADMIN',
      total_exp: 0,
      password_hash: await bcrypt.hash(DEMO_PASSWORD, 10),
      created_at: new Date('2026-10-01T00:00:00Z'),
    }]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { school_id: '2099-0008' }, {});
  },
};