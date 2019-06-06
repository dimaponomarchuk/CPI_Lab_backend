const countryController = require('../controllers').country;
const router = require('express').Router();

router.get(
    '/',
    countryController.getAll
);

router.get(
    '/:country_id',
    countryController.getById
);

router.post(
    '/',
    countryController.create
);

router.put(
    '/:country_id',
    countryController.update
);

router.delete(
    '/:country_id',
    countryController.remove
);

module.exports = router;
