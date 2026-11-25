const { Router } = require('express');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');
const rules = require('../validators/auth.validator');
const controller = require('../controllers/user.controller');

const router = Router();

// The guard comes FIRST: a stranger learns nothing about our validation rules.
router.use(requireUser('ADMIN'));

router.get('/', controller.list);
router.patch('/:id/role', rules.roleRules, validate, controller.changeRole);

module.exports = router;