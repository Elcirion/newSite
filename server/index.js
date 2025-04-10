const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');

const app = express();

// Миддлвары
app.use(cors());
app.use(express.json());

// Подключение маршрутов
app.use('/api/auth', authRoutes);

// Пример запущенного маршрута для администратора
const authenticateToken = require('./middleware/authMiddleware');
const authorizeRoles = require('./middleware/authorizeRoles');
app.get('/api/admin-data', authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.json({ message: 'Привет, администратор!'});
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
