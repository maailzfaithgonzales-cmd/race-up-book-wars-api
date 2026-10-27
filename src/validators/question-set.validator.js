
const { body, param } = require('express-validator');

// Required on create, optional on update
const title = (required) => {
  const start = required
    ? body('title').exists().withMessage('title is required').bail()
    : body('title').optional();

  return start
    .isString().withMessage('title must be text').bail()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('title must be 3 to 100 characters long');
};

const optionalText = (field, max) =>
  body(field).optional()
    .isString().withMessage(`${field} must be text`).bail()
    .trim()
    .isLength({ max })
    .withMessage(`${field} must be at most ${max} characters long`);

const idParam = param('id')
  .isInt({ min: 1 })
  .withMessage('id must be a positive whole number')
  .bail()
  .toInt();

const fields = () => [
  optionalText('description', 1000),
  optionalText('subject', 50),
  optionalText('grade_level', 20),
];

const createRules = [title(true), ...fields()];
const updateRules = [idParam, title(false), ...fields()];

module.exports = { idParam, createRules, updateRules };
