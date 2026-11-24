const { body, param } = require('express-validator');

// SorSU school IDs are 8 digits. We store them as ####-#### (the seed data and the
// automatic check use that form), so "20240001" and "2024-0001" are the same account.
const normalizeSchoolId = (value) => value.replace(/^(\d{4})-?(\d{4})$/, '$1-$2');

const registerSchoolId = () => body('school_id')
  .exists().withMessage('school_id is required').bail()
  .isString().withMessage('school_id must be text').bail()
  .trim()
  .matches(/^\d{4}-?\d{4}$/)
  .withMessage('school_id must be 8 digits, like 2024-0001').bail()
  .customSanitizer(normalizeSchoolId);

const fullName = () => body('full_name')
  .exists().withMessage('full_name is required').bail()
  .isString().withMessage('full_name must be text').bail()
  .trim()
  .isLength({ min: 2, max: 100 })
  .withMessage('full_name must be 2 to 100 characters long');

const email = () => body('email')
  .exists().withMessage('email is required').bail()
  .isString().withMessage('email must be text').bail()
  .trim()
  .isLength({ max: 255 }).withMessage('email must be at most 255 characters long').bail()
  .isEmail().withMessage('email must be a valid email address').bail()
  .customSanitizer((value) => value.toLowerCase());

// bcrypt reads only the first 72 bytes, so longer passwords are refused.
const newPassword = () => body('password')
  .exists().withMessage('password is required').bail()
  .isString().withMessage('password must be text').bail()
  .isLength({ min: 8, max: 72 })
  .withMessage('password must be 8 to 72 characters long').bail()
  .matches(/[A-Za-z]/).withMessage('password must contain a letter').bail()
  .matches(/\d/).withMessage('password must contain a number');

// Login only checks that both fields exist and are text. A wrong ID or password is a 401.
const loginSchoolId = () => body('school_id')
  .exists().withMessage('school_id is required').bail()
  .isString().withMessage('school_id must be text').bail()
  .trim()
  .customSanitizer(normalizeSchoolId);

const loginPassword = () => body('password')
  .exists().withMessage('password is required').bail()
  .isString().withMessage('password must be text');

const idParam = param('id')
  .isInt({ min: 1 }).withMessage('id must be a positive whole number').bail()
  .toInt();

const role = () => body('role')
  .exists().withMessage('role is required').bail()
  .isIn(['PLAYER', 'HOST', 'ADMIN'])
  .withMessage('role must be PLAYER, HOST or ADMIN');

// There is NO rule for "role" in registerRules. With matchedData, a "role"
// sent in the body never reaches the service, so every new account is a PLAYER.
const registerRules = [registerSchoolId(), fullName(), email(), newPassword()];
const loginRules = [loginSchoolId(), loginPassword()];
const roleRules = [idParam, role()];

module.exports = { registerRules, loginRules, roleRules, idParam };