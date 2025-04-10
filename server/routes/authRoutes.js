const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const { User } = require('../models'); // Предположим, что модель User уже создана

// Валидация входных данных
const validateRegister = [
  check('email').isEmail().withMessage('Некорректный email'),
  check('password').isLength({ min: 6 }).withMessage('Пароль должен быть минимум 6 символов'),
];

// Регистрация пользователя
router.post('/register', validateRegister, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    // Проверка существующего пользователя
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован', userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Вход пользователя
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль' });
    }

    // Создание JWT токена
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Вход выполнен успешно', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { register, login } = require('../controllers/authController');

// // Регистрация и логин
// router.post('/register', register);
// router.post('/login', login);

// module.exports = router;