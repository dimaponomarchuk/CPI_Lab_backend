const statusController = require('../controllers').status;
const router = require('express').Router();

router.get(
    '/',
    statusController.getAll
);

router.get(
    '/:status_id',
    statusController.getById
);

router.post(
    '/',
    statusController.create
);

router.put(
    '/:status_id',
    statusController.update
);

router.delete(
    '/:status_id',
    statusController.remove
);

module.exports = router;
