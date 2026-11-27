// The rules for accounts. No req or res here: the controller handles HTTP.
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const password = require('../security/password');
const token = require('../security/token');
const { unauthorized } = require('../errors/app-error');

// Register always creates a PLAYER. A host or admin is made only by an admin (PATCH /users/:id/role).
async function register({ school_id, full_name, email, password: plain }) {
  const password_hash = await password.hash(plain);
  return userRepository.create({ school_id, full_name, email, password_hash, role: 'PLAYER' });
}

async function login({ school_id, password: plain }) {
  const user = await userRepository.findForLogin(school_id);

  // matches() also compares against a dummy hash when the account does not exist,
  // so both failures take the same time. Same code, same message: nothing is revealed.
  const ok = await password.matches(plain, user ? user.password_hash : null);
  if (!ok) throw unauthorized('School ID or password is wrong.', 'INVALID_CREDENTIALS');

  const signed = token.issue(user);
  const { iat, exp } = jwt.decode(signed);
  return { token: signed, expires_in: exp - iat, user };
}

module.exports = { register, login };