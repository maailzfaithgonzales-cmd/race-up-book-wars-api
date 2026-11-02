
const { Op } = require('sequelize');
const { Player, GameSession } = require('../models');

function findSeat(sessionId, userId) {
  return Player.findOne({
    where: { session_id: sessionId, user_id: userId },
  });
}

function countBySession(sessionId) {
  return Player.count({ where: { session_id: sessionId } });
}

// A seat of this account in ANOTHER game that is PLAYING, or null.
function findRunningSeatElsewhere(userId, sessionId) {
  return Player.findOne({
    where: { user_id: userId, session_id: { [Op.ne]: sessionId } },
    include: [{
      model: GameSession,
      where: { status: 'PLAYING' },
      attributes: ['join_code'],
    }],
  });
}

function create(data) {
  return Player.create(data);
}

function findAllBySession(sessionId) {
  return Player.findAll({
    where: { session_id: sessionId },
    order: [['shelf_position', 'DESC'], ['player_id', 'ASC']],
  });
}

module.exports = {
  findSeat,
  countBySession,
  findRunningSeatElsewhere,
  create,
  findAllBySession,
};
