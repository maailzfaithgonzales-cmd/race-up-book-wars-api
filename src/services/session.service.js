
const crypto = require('crypto');
const sessionRepository = require('../repositories/session.repository');
const questionSetService = require('./question-set.service');
const { notFound, forbidden, conflict } = require('../errors/app-error');

// The one status each status may become.
const NEXT_STATUS = { WAITING: 'PLAYING', PLAYING: 'ENDED' };

async function findOrFail(code) {
  const session = await sessionRepository.findByCode(code);

  if (!session) {
    throw notFound('SESSION_NOT_FOUND', `No game has the code ${code}.`);
  }

  return session;
}

function isHost(session, user) {
  return session.host_user_id === user.user_id || user.role === 'ADMIN';
}

// The server generates the six-digit code (100000 to 999999).
async function makeCode() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = String(crypto.randomInt(100000, 1000000));

    if (!(await sessionRepository.findByCode(code))) {
      return code;
    }
  }

  throw conflict('CODE_UNAVAILABLE', 'Could not make a join code. Try again.');
}

// The host must own the question set.
async function create(data, user) {
  await questionSetService.get(data.set_id, user);

  const joinCode = await makeCode();

  return sessionRepository.create({
    ...data,
    join_code: joinCode,
    host_user_id: user.user_id,
  });
}

// Only the host changes the status, one step at a time.
async function changeStatus(code, status, user) {
  const session = await findOrFail(code);

  if (!isHost(session, user)) {
    throw forbidden('This game belongs to another host.');
  }

  if (NEXT_STATUS[session.status] !== status) {
    throw conflict(
      'INVALID_STATUS_CHANGE',
      `A game that is ${session.status} cannot become ${status}.`
    );
  }

  const changes = { status };

  if (status === 'PLAYING') {
    changes.started_at = new Date();
  }

  if (status === 'ENDED') {
    changes.ended_at = new Date();
  }

  return sessionRepository.update(session, changes);
}

module.exports = { findOrFail, create, changeStatus };
