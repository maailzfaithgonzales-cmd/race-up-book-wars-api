const { matchedData } = require('express-validator');
const authService = require('../services/auth.service');
const { toJson } = require('../utils/user-json');

async function register(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const user = await authService.register(data);
  res.status(201).json({ user: toJson(user) });
}

async function login(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const { token, expires_in, user } = await authService.login(data);
  res.status(200).json({ token, expires_in, user: toJson(user) });
}

// req.account was filled in by the currentUser middleware from the token.
async function me(req, res) {
  res.status(200).json({ user: toJson(req.account) });
}

module.exports = { register, login, me };