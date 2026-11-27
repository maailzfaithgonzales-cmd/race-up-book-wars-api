const userRepository = require('../repositories/user.repository');
const { notFound, conflict } = require('../errors/app-error');

function list() {
  return userRepository.findAll();
}

async function changeRole(id, role, actor) {
  // An admin cannot change their own role, so the system can never be left without an admin by accident.
  if (id === actor.user_id) {
    throw conflict('CANNOT_CHANGE_OWN_ROLE', 'An admin cannot change their own role.');
  }
  const user = await userRepository.findById(id);
  if (!user) throw notFound('USER_NOT_FOUND', 'There is no account with that id.');
  return userRepository.update(user, { role });
}

module.exports = { list, changeRole };