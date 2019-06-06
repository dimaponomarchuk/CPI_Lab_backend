const formController = require('../controllers').form;
const router = require('express').Router();

router.get(
    '/',
    formController.getAll
);

router.get(
    '/:form_id',
    formController.getById
);

router.post(
    '/',
    formController.create
);

router.put(
    '/:form_id',
    formController.update
);

router.delete(
    '/:form_id',
    formController.remove
);

module.exports = router;
