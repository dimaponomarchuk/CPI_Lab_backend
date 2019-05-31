const userController = require('../controllers').user;
const router = require('express').Router();

router.get(
    '/',
    userController.getAll
);

router.get(
    '/:user_id',
    userController.getById
);

router.post(
    '/',
    userController.create
);

router.put(
    '/:user_id',
    userController.update
);

router.delete(
    '/:user_id',
    userController.remove
);

module.exports = router;
