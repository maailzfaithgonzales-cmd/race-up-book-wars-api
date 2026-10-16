'use strict';

const NICKNAMES = ['host_maria', 'Mika', 'Tonio', 'Lani', 'Bert', 'Coco'];

module.exports = {
  async up(queryInterface) {
    const created = new Date('2026-10-01T00:00:00Z');
    const base = { password_hash: 'demo-not-a-real-hash', total_exp: 0, created_at: created };
    await queryInterface.bulkInsert('users', [
      { ...base, nickname: 'host_maria', role: 'HOST',   school_id: '2099-0001', full_name: 'Maria Demo Host',  email: 'host.maria@demo.test' },
      { ...base, nickname: 'Mika',       role: 'PLAYER', school_id: '2099-0002', full_name: 'Mika Demo Player', email: 'mika@demo.test' },
      { ...base, nickname: 'Tonio',      role: 'PLAYER', school_id: '2099-0003', full_name: 'Tonio Demo Player', email: 'tonio@demo.test' },
      { ...base, nickname: 'Lani',       role: 'PLAYER', school_id: '2099-0004', full_name: 'Lani Demo Player', email: 'lani@demo.test' },
      { ...base, nickname: 'Bert',       role: 'PLAYER', school_id: '2099-0005', full_name: 'Bert Demo Player', email: 'bert@demo.test' },
      { ...base, nickname: 'Coco',       role: 'PLAYER', school_id: '2099-0006', full_name: 'Coco Demo Player', email: 'coco@demo.test' },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { nickname: NICKNAMES }, {});
  },
};