const userController = require('../controllers').user;
const router = require('express').Router();
const authenticateMiddleware = require('../middlewares/authenticateMiddlerware');

router.get(
    '/',
    authenticateMiddleware(),
    userController.getAll
);

router.get(
    '/:user_id',
    authenticateMiddleware(),
    userController.getById
);

router.post(
    '/',
    authenticateMiddleware(),
    userController.create
);

router.put(
    '/:user_id',
    authenticateMiddleware(),
    userController.update
);

router.delete(
    '/:user_id',
    authenticateMiddleware(),
    userController.remove
);

module.exports = router;
