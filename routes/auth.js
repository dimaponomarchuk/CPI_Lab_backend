const authControlelr = require('../controllers').auth;
const router = require('express').Router();

router.post(
  '/login',
  authControlelr.login
);

module.exports = router;
