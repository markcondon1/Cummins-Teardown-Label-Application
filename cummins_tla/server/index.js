const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
//const fetch = require('node-fetch');
const axios = require('axios');
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
        const query = 'SELECT userid, firstname, lastname, password FROM users WHERE userid = $1 AND password = $2';
        const { rows } = await pool.query(query, [username, password]);

        if (rows.length === 1) {
            // User found, authentication successful
            const user = rows[0];
            const { userid, firstname, lastname } = user;
            res.json({ success: true, message: 'Login successful', user: { userid, firstname, lastname } });
        } else {
            // No user found with the provided credentials
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/api/reman', async (req, res) => {
    const {item_segment1} = req.body;
    try {
        // Query database 
        const query = 'SELECT "ITEM_SEGMENT1","COMP_SERIAL_NUMBER" FROM "mes_scrap_info" WHERE "ITEM_SEGMENT1" = $1';
        const { rows } = await pool.query(query, [item_segment1]);

        if (rows.length >= 1) { //do this because I am unsure of what we are querying still
            //success
            const data = rows[0];
            const { ITEM_SEGMENT1, COMP_SERIAL_NUMBER } = data;
            res.json({ success: true, message: 'Query successful', data: {ITEM_SEGMENT1, COMP_SERIAL_NUMBER}});
        } else {
            // No entries with the specified part number
            res.status(401).json({ success: false, message: 'Invalid part number'});
        }

    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

//printer logic

// app.post('/api/printlabel', async (req, res) => {
//     const zpl = `^XA
// ^FO50,100^A0N,50,50^FB500,2,0,C^FD4040880^FS
// ^FO50,180^A0N,50,50^FB500,1,0,C^FDShaft&Wheel^FS
// ^FO50,250^A0N,50,50^FB500,1,0,C^FDHE451Ve^FS
// ^FO`
// });

app.listen(8080, () => {
    console.log('server listening on port 8080');
});
