const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, getUserByUsername } = require('../models/userModels');

const register = async (req, res) => {
    try {
        const { username, password, role} = req.body;

        // Проверка, существует ли пользователь
        const existing = await getUserByUsername(username);
        if (existing) {
            return res.status(400).json({ message: 'Пользователь не существует'});
        }

        const user = await createUser({ username, password, role});
        res.status(201).json({ message: 'Пользователь зарегистрирован', user});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password} = req.body;
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Неверные данные'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({ message: 'Неверные данные'});
        }
        // Генерируем JWT-токен
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports = { register, login };