
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
    game_users_school_id_key: {
    status: 409,
    code: 'SCHOOL_ID_TAKEN',
    message: 'An account with that school ID already exists.',
  },
  users_email_key: {
    status: 409,
    code: 'EMAIL_TAKEN',
    message: 'An account with that email already exists.',
  },
};
