const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    user: 'postgres.paixptuglhwecgkdjfwm',
    host: 'aws-0-us-east-1.pooler.supabase.com',
    database: 'postgres',
    password: 'CumminsTLA_Pass',
    port: 5432,
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

app.get('/api/data', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query  database to find the user with the trying to login
        const query = 'SELECT * FROM users WHERE userid = $1 AND password = $2';
        const { rows } = await pool.query(query, [username, password]);

        if (rows.length === 1) {
            // User found, authentication successful
            res.json({ success: true, message: 'Login successful', user: rows[0] });
        } else {
            // No user found with the provided credentials
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


app.listen(8080, () => {
    console.log('server listening on port 8080');
});
