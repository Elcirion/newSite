const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Регистрация и логин
router.post('/register', register);
router.post('/login', login);

module.exports = router;