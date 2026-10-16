'use strict';

const STARTED = new Date('2026-10-09T01:00:00Z');
const ENDED = new Date('2026-10-09T01:12:00Z');

// picks = the choice index each player chose, question by question
const PLAYERS = [
  { nickname: 'Mika',  shelf: 30, ranking: 1, picks: [0, 2, 1, 3, 0] },
  { nickname: 'Tonio', shelf: 24, ranking: 2, picks: [0, 2, 0, 3, 0] },
  { nickname: 'Lani',  shelf: 24, ranking: 2, picks: [0, 1, 1, 3, 0] }, // awkward case: a tie with Tonio
  { nickname: 'Bert',  shelf: 9,  ranking: 4, picks: [0, 2] },          // left early: did not complete
];

module.exports = {
  async up(queryInterface) {
    const db = queryInterface.sequelize;

    // 1. find the parents the earlier seeders created
    const [[host]] = await db.query("SELECT user_id FROM game_users WHERE nickname = 'host_maria'");
    const [[set]] = await db.query("SELECT set_id FROM question_sets WHERE title = 'Book Basics Demo'");
    const [questions] = await db.query(
      'SELECT question_id, correct_index FROM questions WHERE set_id = :setId ORDER BY question_id',
      { replacements: { setId: set.set_id } });
    const [users] = await db.query(
      "SELECT user_id, nickname FROM game_users WHERE nickname IN ('Mika','Tonio','Lani','Bert')");
    const userId = Object.fromEntries(users.map((u) => [u.nickname, u.user_id]));

    // 2. a game that has ENDED
    await queryInterface.bulkInsert('game_sessions', [{
      join_code: '730512',
      host_user_id: host.user_id,
      set_id: set.set_id,
      status: 'ENDED',
      created_at: new Date('2026-10-09T00:50:00Z'),
      started_at: STARTED,
      ended_at: ENDED,
      time_limit_sec: 30,
    }]);
    const [[session]] = await db.query(
      'SELECT session_id FROM game_sessions WHERE started_at = :s',
      { replacements: { s: STARTED.toISOString() } });

    // 3. its players
    await queryInterface.bulkInsert('players', PLAYERS.map((p) => ({
      session_id: session.session_id,
      user_id: userId[p.nickname],
      nickname: p.nickname,
      player_token_hash: `demo-token-${p.nickname.toLowerCase()}`,
      token_expires_at: new Date('2026-10-09T02:12:00Z'),
      shelf_position: p.shelf,
      ranking: p.ranking,
      session_output: JSON.stringify({
        final_shelf_position: p.shelf,
        ranking: p.ranking,
        status: p.picks.length === questions.length ? 'COMPLETED' : 'LEFT_EARLY',
        exp_awarded: p.ranking === 1 ? 100 : 0,
      }),
      joined_at: new Date('2026-10-09T00:57:00Z'),
    })));
    const [players] = await db.query(
      'SELECT player_id, nickname FROM players WHERE session_id = :id',
      { replacements: { id: session.session_id } });
    const playerId = Object.fromEntries(players.map((p) => [p.nickname, p.player_id]));

    // 4. progress, answers and the retry pool
    const progress = [];
    const answers = [];
    const retry = [];
    for (const p of PLAYERS) {
      questions.forEach((question, i) => {
        const answered = i < p.picks.length;
        const at = new Date(STARTED.getTime() + (i + 1) * 120000);
        progress.push({
          player_id: playerId[p.nickname],
          question_id: question.question_id,
          status: answered ? 'COMPLETED' : 'PENDING',
          attempts: answered ? 1 : 0,
          completed_at: answered ? at : null,
        });
        if (answered) {
          const correct = p.picks[i] === question.correct_index;
          answers.push({
            player_id: playerId[p.nickname],
            question_id: question.question_id,
            choice_index: p.picks[i],
            is_correct: correct,
            answered_at: at,
          });
          if (!correct) {
            retry.push({ player_id: playerId[p.nickname], question_id: question.question_id, added_at: at });
          }
        }
      });
    }
    await queryInterface.bulkInsert('player_question_progress', progress);
    await queryInterface.bulkInsert('answers', answers);
    await queryInterface.bulkInsert('retry_pool', retry);

    // 5. final leaderboard, then the host awards EXP to the winner
    await queryInterface.bulkInsert('leaderboard', PLAYERS.map((p) => ({
      player_id: playerId[p.nickname],
      score: p.shelf,
      rank_position: p.ranking,
      achieved_at: ENDED,
    })));
    await queryInterface.bulkInsert('exp_transactions', [{
      user_id: userId.Mika,
      session_id: session.session_id,
      host_user_id: host.user_id,
      exp_amount: 100,
      awarded_at: new Date('2026-10-09T01:15:00Z'),
    }]);
    await queryInterface.bulkUpdate('game_users', { total_exp: 100 }, { user_id: userId.Mika });
  },

  async down(queryInterface) {
    const db = queryInterface.sequelize;
    const [[session]] = await db.query(
      'SELECT session_id FROM game_sessions WHERE started_at = :s',
      { replacements: { s: STARTED.toISOString() } });
    await queryInterface.bulkUpdate('game_users', { total_exp: 0 }, { nickname: 'Mika' });
    if (session) {
      await queryInterface.bulkDelete('exp_transactions', { session_id: session.session_id }, {});
      // players and everything under them are removed by ON DELETE CASCADE
      await queryInterface.bulkDelete('game_sessions', { session_id: session.session_id }, {});
    }
  },
};