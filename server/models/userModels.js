const pool = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async ({username, password, role = 'user'}) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
        [username, hashedPassword, role]
    );
    return result.rows[0];
};

const getUserByUsername = async (username) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
};

module.exports = { createUser, getUserByUsername };