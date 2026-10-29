
const { body, param } = require('express-validator');

const codeParam = param('code')
  .matches(/^[1-9][0-9]{5}$/)
  .withMessage('the join code must be six digits');

const setId = () => body('set_id')
  .exists().withMessage('set_id is required').bail()
  .isInt({ min: 1 })
  .withMessage('set_id must be a positive whole number').bail()
  .toInt();

const timeLimit = () => body('time_limit_sec').optional()
  .isInt({ min: 1, max: 600 })
  .withMessage('time_limit_sec must be a whole number from 1 to 600').bail()
  .toInt();

const maxPlayers = () => body('max_players').optional()
  .isInt({ min: 1, max: 100 })
  .withMessage('max_players must be a whole number from 1 to 100').bail()
  .toInt();

const status = () => body('status')
  .exists().withMessage('status is required').bail()
  .isIn(['PLAYING', 'ENDED'])
  .withMessage('status must be PLAYING or ENDED');

const nickname = () => body('nickname')
  .exists().withMessage('nickname is required').bail()
  .isString().withMessage('nickname must be text').bail()
  .trim()
  .isLength({ min: 2, max: 24 })
  .withMessage('nickname must be 2 to 24 characters long');

const createRules = [setId(), timeLimit(), maxPlayers()];
const statusRules = [codeParam, status()];
const joinRules = [codeParam, nickname()];

module.exports = { codeParam, createRules, statusRules, joinRules };
