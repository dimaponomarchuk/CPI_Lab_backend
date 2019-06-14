const authController = require('../controllers').auth;
const router = require('express').Router();
const passport = require('passport');
const authenticate = passport.authenticate('local', {session: true});
const authenticateMiddleware = require('../middlewares/authenticateMiddlerware');

router.post(
  '/login',
  authenticate,
  authController.login
);

router.post(
  '/register',
  authController.register
);

router.post(
  '/logout',
  authenticateMiddleware(),
  authController.logout
);

module.exports = router;
