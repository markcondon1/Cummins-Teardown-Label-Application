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
        tableName: 'mes_linerejection_info',

});

 const MES_WIP_INFO = sequelize.define('mes_wip_info', {
 },
     {tableName: 'mes_wip_info',
 });

 //connect wip and bom tables
//MES_BOM_COMPONENTS.belongsTo(MES_WIP_INFO, { foreignKey: 'WIP_JOB_NUMBER', targetKey: 'WIP_JOB_NUMBER' });

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
app.post('/api/teardowntray', async (req, res) => {
    const { newVal } = req.body;
    console.log("component ", newVal);
    try {

      // const query = ` SELECT  "ID21_ITEM_NUMBER", "COMPONENT_ITEM_NUMBER", "COMPONENT_DESCRIPTION" FROM mes_bom_components "COMPONENT_ITEM_NUMBER" = ${newVal}`;
       const results = await MES_BOM_COMPONENTS.findAll({
            attributes: ['ID21_ITEM_NUMBER', 'COMPONENT_ITEM_NUMBER', 'COMPONENT_DESCRIPTION', 'ORG_ID','OP_CODE'], // Select specific attributes
           where: sequelize.where(
               sequelize.literal('CAST("COMPONENT_ITEM_NUMBER" AS INTEGER)'), // Cast COMPONENT_ITEM_NUMBER to INTEGER
               newVal
           )
        });
        console.log('Query executed:', results);
        if (results) {
            res.json({ success: true, data: results });
        } else {
            res.status(404).json({ success: false, message: 'No results found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while searching.' });
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
    console.log("user and password ", username, password);

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

app.post('/api/getModel', async (req, res) => {
    const { newVal } = req.body;
    console.log("input  ", newVal);
    try {
        const query = 'SELECT w."MODEL_NUMBER"\n' +
            'FROM MES_WIP_INFO w\n' +
            'JOIN MES_BOM_COMPONENTS b\n' +
            'ON w."ORG_ID" = b."ORG_ID"\n' +
            'AND w."ID21_ITEM_NUMBER" = b."ID21_ITEM_NUMBER"\n' +
            'AND w."WIP_JOB_NUMBER" = b."WIP_JOB_NUMBER"\n' +
            `WHERE b."COMPONENT_ITEM_NUMBER" = '${newVal}';
`
        const [model, metadata] = await sequelize.query(query, {
            //  replacements: { newVal },
            type: QueryTypes.SELECT
        });

        console.log('Query executed:', model);
        if (model) {
            //   const modelNumber = model.MODEL_NUMBER;
            res.json({ success: true, data: model });
        } else {
            res.status(404).json({ error: 'Model not found' });
        }
    } catch (error) {
        console.error('Error fetching model number:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('api/firstFit', async (req,res) =>{
        const serial = req.query.serial;
        const id21 = req.query.id21;
        try {
            // Query database
            const query = 
            `SELECT assy."SERIAL_NUMBER", bom."ID21_ITEM_NUMBER", bom."COMPONENT_ITEM_NUMBER", wip."MODEL_NUMBER", bom."COMMODITY_TYPE"
            FROM mes_assy_job_info AS assy
            INNER JOIN mes_bom_components AS bom ON assy."ID21_ITEM_NUMBER" = bom."ID21_ITEM_NUMBER"
            INNER JOIN mes_wip_info AS wip ON bom."WIP_JOB_NUMBER" = wip."WIP_JOB_NUMBER"
            WHERE (bom."COMMODITY_TYPE" = 'TURBINE HOUSING' OR bom."COMMODITY_TYPE" = 'COMPRESSOR HOUSING' OR bom."COMMODITY_TYPE" = 'SHROUD') AND assy."SERIAL_NUMBER" = :serial AND bom."ID21_ITEM_NUMBER" = :id21
            ORDER BY bom."COMMODITY_TYPE" ASC`;

            const [data, metadata] = await sequelize.query(query, {
                replacements: {serial:serial, id21:id21},
                type:QueryTypes.SELECT
            });
            if (data) {
                //success
                console.log(data);
                res.json({ success: true, message: 'Query successful', data:data});
            } else {
                // No entries with the specified part number
                res.status(401).json({ success: false, message: 'Invalid ID21 or Serial Number'});
            }
    
        } catch (error) {
            console.error('Error executing query', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
});

app.listen(8080, () => {
    console.log('server listening on port 8080');
});
