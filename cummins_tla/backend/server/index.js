const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
//const fetch = require('node-fetch');
const axios = require('axios');
const { Pool } = require('pg');

app.use(cors());
app.use(bodyParser.json());


//set up sequelize ORM
const sequelize = require('./database/sequelize');
const {DataTypes, QueryTypes, Sequelize} = require("sequelize");



// Define the User model
const User = sequelize.define('users', {
},
{
    tableName: 'users',
});

const mes_bom_components = sequelize.define('mes_bom_components',{
},
    {
        tableName: 'mes_bom_components',
    });

const mes_linerejection_= sequelize.define('mes_scrap_info', {
},
    {
        tableName: 'mes_bom_components',

});

 const mes_wip_info = sequelize.define('mes_wip_info', {
 },
     {tableName: 'mes_wip_info',
 });

// Syncing User model with the database table "users"
(async () => {
    try {
        await sequelize.sync();
        console.log('User model synced successfully.');
    } catch (error) {
        console.error('Error syncing User model:', error);
    } finally {
      //  sequelize.close();
        // Close the connection after syncing
    }
})();



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


app.get('/api/mesComponents', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT "ID21_ITEM_NUMBER" , "COMPONENT_ITEM_NUMBER", "COMPONENT_DESCRIPTION" FROM mes_bom_components');
        res.json({success: true, message:'success', rows });
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/mesComponents', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT "ID21_ITEM_NUMBER" , "COMPONENT_ITEM_NUMBER", "COMPONENT_DESCRIPTION" FROM mes_bom_components');
        res.json({success: true, message:'success', rows });
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/firstFit', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT "COMPONENT_ITEM_NUMBER", "ID21_ITEM_NUMBER" FROM mes_bom_components');
        res.json({success: true, message:'success', rows });
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/modelNumber', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT "ID21_ITEM_NUMBER", "MODEL_NUMBER"  FROM mes_wip_info');
        res.json({success: true, message:'slay', rows });
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query  database to find the user with the trying to login
        const query = 'SELECT userid, firstname, lastname FROM users WHERE userid = :username AND password = :password';
        const [user, metadata] = await sequelize.query(query, {
            replacements: { username, password },
            type: QueryTypes.SELECT
        });
        if (user) {
            // User found, authentication successful
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

app.get('/api/reman', async (req, res) => {
    const item_segment1 = req.query.item;
    try {
        // Query database
        const query = 'SELECT "ITEM_SEGMENT1" FROM "mes_scrap_info" WHERE "ITEM_SEGMENT1" = $1';
        const { rows } = await pool.query(query, [item_segment1]);

        if (rows.length >= 1) {
            res.json({ success: true, message: 'Success!'});
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
