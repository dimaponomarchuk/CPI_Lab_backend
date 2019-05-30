const userController = require('../controllers').user;
const router = require('express').Router();

router.get(
    '/',
    userController.getAll
);

router.get(
    '/:act_id',
    userController.getById
);

router.post(
    '/',
    userController.create
);

router.put(
    '/:act_id',
    userController.update
);

router.delete(
    '/:act_id',
    userController.remove
);

module.exports = router;
