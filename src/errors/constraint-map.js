
module.exports = {
  uq_player_nickname: {
    status: 409,
    code: 'NICKNAME_TAKEN',
    message: 'That nickname is already used in this game.',
  },
  game_sessions_set_id_fkey: {
    status: 409,
    code: 'QUESTION_SET_IN_USE',
    message: 'This question set was used in a game and cannot be deleted.',
  },
};
