'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [{
      nickname: 'host_ben',
      password_hash: 'demo-not-a-real-hash',
      role: 'HOST',
      total_exp: 0,
      school_id: '2099-0007',
      full_name: 'Ben Demo Host',
      email: 'ben@demo.test',
      created_at: new Date('2026-10-01T00:00:00Z'),
    }]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { nickname: 'host_ben' }, {});
  },
};