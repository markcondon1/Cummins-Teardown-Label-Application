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

const MES_BOM_COMPONENTS = sequelize.define('mes_bom_components',{
},
    {
        tableName: 'mes_bom_components',
    });

const MES_LINEREJECTION= sequelize.define('mes_scrap_info', {
},
    {
        tableName: 'mes_scrap_info',

});

 const MES_WIP_INFO = sequelize.define('mes_wip_info', {
 },
     {tableName: 'mes_wip_info',
 });
const PRINT_LOGS = sequelize.define('printer_logs', {

},
    {tableName: 'printer_logs',
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
    const { id21_number, component_number } = req.query; // Use req.query for GET requests
    try {
        const query = `
            SELECT "ID21_ITEM_NUMBER", "COMPONENT_ITEM_NUMBER", "COMPONENT_DESCRIPTION"
            FROM mes_bom_components
            WHERE "COMPONENT_ITEM_NUMBER" = :component_number
            AND "ID21_ITEM_NUMBER" = :id21_number
        `;
        const [component, metadata] = await sequelize.query(query, {
            replacements: { id21_number, component_number }, // Use named replacements
            type: QueryTypes.SELECT
        });
        if (component) {
            res.json({ success: true, message: 'Component found', component });
        } else {
            res.status(404).json({ success: false, message: 'Component not found' });
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/mesComponents', async (req, res) => {
    const { id21_number, component_number } = req.body;
    try {
        const query = `
            SELECT "ID21_ITEM_NUMBER", "COMPONENT_ITEM_NUMBER", "COMPONENT_DESCRIPTION"
            FROM mes_bom_components
            WHERE "COMPONENT_ITEM_NUMBER" = :component_number
              AND "ID21_ITEM_NUMBER" = :id21_number
        `;
        const [component, metadata] = await sequelize.query(query, {
            replacements: { id21_number, component_number },
            type: QueryTypes.SELECT
        });
        if (component) {
            res.json({ success: true, message: 'Component found', component });
        } else {
            res.status(404).json({ success: false, message: 'Component not found' });
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.post('/api/mesComponents', async (req, res) => {
    const { id21_number, component_number } = req.body;
    try {
        const query = `
        SELECT "ID21_ITEM_NUMBER", "COMPONENT_ITEM_NUMBER", "COMPONENT_DESCRIPTION"
        FROM mes_bom_components
        WHERE "COMPONENT_ITEM_NUMBER" = $2
        AND "ID21_ITEM_NUMBER" = $1
    `;
        const[component, metadata ] = await sequelize.query(query, {
            replacements: {id21_number, component_number},
            type: QueryTypes.SELECT
        });
      if(component) {
          res.json({ success: true, message: 'Login successful', component: {component_number, id21_number} });
      }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('api/printerLogs', async (req, res) => {
    const {userid, time, date} = req.body;
    try{
        const query = 'INSERT INTO printer_logs (userId, time_printed, date_printed) VALUES (:userid, :current_time, :current_date)';
        const[log, metadata ] = await sequelize.query(query, {
            replacements: { userid, time,date},
            type: QueryTypes.INSERT,
        });
        if(log){
            res.json({ success: true, message: 'Login successful', log });

        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/api/firstFit', async (req, res) => {
    const modelNumber = req.body;
    try {
        const query = 'SELECT "COMPONENT_ITEM_NUMBER", "ID21_ITEM_NUMBER" FROM mes_bom_components';
        const { rows } = await sequelize.query(query, {
            replacements: modelNumber,
            type: QueryTypes.SELECT
        });
        res.json({success: true, message:'success', rows });
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/modelNumber', async (req, res) => {
    const modelNumber = req.body;
    try {
        const query = 'SELECT "ID21_ITEM_NUMBER", "MODEL_NUMBER"  FROM mes_wip_info'
        const { rows } = await sequelize.query(query, {
            replacements: modelNumber,
            type: QueryTypes.SELECT
            }

        );
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
        const query = 'SELECT userid, password, firstname,lastname FROM users WHERE userid = :username AND password = :password';
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
        const query = 'SELECT "ITEM_SEGMENT1" FROM "mes_scrap_info" WHERE "ITEM_SEGMENT1" = :item_segment1';
        const [item, metadata] = await sequelize.query(query, {
            replacements: {item_segment1: item_segment1},
            type:QueryTypes.SELECT
        });
        if (item) {
            //success
            res.json({ success: true, message: 'Query successful'});
        } else {
            // No entries with the specified part number
            res.status(401).json({ success: false, message: 'Invalid part number'});
        }

    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

const getModelNumbers = async () => {
    try {
        const modelNumbers = await MES_BOM_COMPONENTS.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('mw.MODEL_NUMBER')), 'MODEL_NUMBER']],
            include: [{
                model: MES_WIP_INFO,
                where: sequelize.literal('MES_BOM_COMPONENTS.ORG_ID = MES_WIP_INFO.ORG_ID AND MES_BOM_COMPONENTS.ID21_ITEM_NUMBER = MES_WIP_INFO.ID21_ITEM_NUMBER AND MES_BOM_COMPONENTS.WIP_JOB_NUMBER = MES_WIP_INFO.WIP_JOB_NUMBER')
            }],
            raw: true
        });
        return modelNumbers;
    } catch (error) {
        throw new Error('Error fetching model numbers: ' + error.message);
    }
};


app.post('/getModel', async (req, res) => {
    try {
        const modelNumbers = await getModelNumbers();
        res.json(modelNumbers);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
