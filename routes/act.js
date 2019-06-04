const actController = require('../controllers').act;
const router = require('express').Router();
const authenticateMiddleware = require('../middlewares/authenticateMiddlerware');

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
  authenticateMiddleware(),
  actController.create
);

router.put(
  '/:act_id',
  authenticateMiddleware(),
  actController.update
);

router.delete(
  '/:act_id',
  authenticateMiddleware(),
  actController.remove
);

module.exports = router;
