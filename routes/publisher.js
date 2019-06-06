const publisherController = require('../controllers').publisher;
const router = require('express').Router();

router.get(
    '/',
    publisherController.getAll
);

router.get(
    '/:publisher_id',
    publisherController.getById
);

router.post(
    '/',
    publisherController.create
);

router.put(
    '/:publisher_id',
    publisherController.update
);

router.delete(
    '/:publisher_id',
    publisherController.remove
);

module.exports = router;
