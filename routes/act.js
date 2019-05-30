const actController = require('../controllers').act;
const router = require('express').Router();

router.get(
  '/',
  actController.getAll
);

router.get(
  '/:act_id',
  actController.getById
);

router.post(
  '/',
  actController.create
);

router.put(
  '/:act_id',
  actController.update
);

router.delete(
  '/:act_id',
  actController.remove
);

module.exports = router;
