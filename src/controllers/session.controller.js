
const { matchedData } = require('express-validator');
const sessionService = require('../services/session.service');

function toJson(session) {
  return {
    code: session.join_code,
    status: session.status,
    set_id: session.set_id,
    host_id: session.host_user_id,
    max_players: session.max_players,
    time_limit_sec: session.time_limit_sec,
    created_at: session.created_at,
    started_at: session.started_at,
    ended_at: session.ended_at,
  };
}

async function create(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const session = await sessionService.create(data, req.user);

  res.status(201).json(toJson(session));
}

async function get(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const session = await sessionService.findOrFail(code);

  res.status(200).json(toJson(session));
}

async function changeStatus(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const { status } = matchedData(req, { locations: ['body'] });

  const session = await sessionService.changeStatus(
    code,
    status,
    req.user
  );

  res.status(200).json(toJson(session));
}

module.exports = { create, get, changeStatus };
