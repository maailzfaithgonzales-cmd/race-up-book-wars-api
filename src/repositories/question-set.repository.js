const { QuestionSet } = require('../models');

function findAllByHost(hostId) {
  return QuestionSet.findAll({
    where: { host_id: hostId },
    order: [['set_id', 'ASC']]
  });
}

function findAll() {
  return QuestionSet.findAll({
    order: [['set_id', 'ASC']]
  });
}

function findById(id) {
  return QuestionSet.findByPk(id);
}

function create(data) {
  return QuestionSet.create(data);
}

function update(questionSet, changes) {
  return questionSet.update(changes);
}

function remove(questionSet) {
  return questionSet.destroy();
}

module.exports = {
  findAllByHost,
  findAll,
  findById,
  create,
  update,
  remove
};