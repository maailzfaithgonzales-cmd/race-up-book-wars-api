
const playerRepository = require('../repositories/player.repository');
const sessionService = require('./session.service');
const { conflict } = require('../errors/app-error');

async function join(code, nickname, user) {
  // Question 3: Does a game with this code exist?
  const session = await sessionService.findOrFail(code);

  // Question 4: Rejoin. This account already has a seat.
  // Return the same seat and preserve its score.
  const seat = await playerRepository.findSeat(
    session.session_id,
    user.user_id
  );

  if (seat) {
    return { session, player: seat, created: false };
  }

  // Question 5: One game at a time.
  const elsewhere = await playerRepository.findRunningSeatElsewhere(
    user.user_id,
    session.session_id
  );

  if (elsewhere) {
    throw conflict(
      'ALREADY_IN_GAME',
      'You are still playing another game. Finish it first.'
    );
  }

  // Question 6: A new seat is allowed only in the lobby.
  if (session.status === 'ENDED') {
    throw conflict('SESSION_ENDED', 'This game has ended.');
  }

  if (session.status !== 'WAITING') {
    throw conflict(
      'SESSION_NOT_JOINABLE',
      'This game has already started.'
    );
  }

  // Question 7: Is there room?
  const seatsTaken = await playerRepository.countBySession(
    session.session_id
  );

  if (seatsTaken >= session.max_players) {
    throw conflict('SESSION_FULL', 'This game is full.');
  }

  // Question 8: The database checks whether the nickname is available.
  const player = await playerRepository.create({
    session_id: session.session_id,
    user_id: user.user_id,
    nickname,
  });

  return { session, player, created: true };
}

async function list(code) {
  const session = await sessionService.findOrFail(code);

  return playerRepository.findAllBySession(session.session_id);
}

module.exports = { join, list };
