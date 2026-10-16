'use strict';

const NICKNAMES = ['host_maria', 'Mika', 'Tonio', 'Lani', 'Bert', 'Coco'];

module.exports = {
  async up(queryInterface) {
    const created = new Date('2026-10-01T00:00:00Z');
    await queryInterface.bulkInsert('game_users', [
      { nickname: 'host_maria', password_hash: 'demo-not-a-real-hash', role: 'HOST',   total_exp: 0, school_id: '2099-0001', created_at: created },
      { nickname: 'Mika',       password_hash: 'demo-not-a-real-hash', role: 'PLAYER', total_exp: 0, school_id: '2099-0002', created_at: created },
      { nickname: 'Tonio',      password_hash: 'demo-not-a-real-hash', role: 'PLAYER', total_exp: 0, school_id: '2099-0003', created_at: created },
      { nickname: 'Lani',       password_hash: 'demo-not-a-real-hash', role: 'PLAYER', total_exp: 0, school_id: '2099-0004', created_at: created },
      { nickname: 'Bert',       password_hash: 'demo-not-a-real-hash', role: 'PLAYER', total_exp: 0, school_id: '2099-0005', created_at: created },
      // awkward case: an account that never joined any game
      { nickname: 'Coco',       password_hash: 'demo-not-a-real-hash', role: 'PLAYER', total_exp: 0, school_id: '2099-0006', created_at: created },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('game_users', { nickname: NICKNAMES }, {});
  },
};