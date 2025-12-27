const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'gerente'),
  (req, res) => {
    res.json({ message: 'Lista de usuários' });
  }
);

module.exports = router;
