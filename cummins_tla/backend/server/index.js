const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
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

 const printer_logs = sequelize.define('printer_logs',{
 },
     { tableName: 'printer_logs',
   });

 //load model to make sure the database is synced
(async () => {
    try {
        await sequelize.sync();
        console.log('database synced successfully.');
    } catch (error) {
        console.error('Error syncing database', error);
    }
})();

//backend post function to query the components description, org id, op code, and id21 number passed off a users
//component item number input
app.post('/api/teardowntray', async (req, res) => {
    const { newVal } = req.body;
    console.log("component ", newVal);
    try {
       const results = await MES_BOM_COMPONENTS.findAll({
            attributes: ['ID21_ITEM_NUMBER', 'COMPONENT_ITEM_NUMBER', 'COMPONENT_DESCRIPTION', 'ORG_ID','OP_CODE'],
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

app.post('/api/firstFit', async (req, res) => {
    const { newVal } = req.body;
    console.log("component ", newVal);
    try {
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

//post function to query the users information from the database upon successfully logging in
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("user and password ", username, password);

    try {
        const query = 'SELECT userid, password, firstname,lastname, admin FROM users WHERE userid = :username AND password = :password';
        const [user, metadata] = await sequelize.query(query, {
            replacements: { username, password },
            type: QueryTypes.SELECT
        });
        if (user) {
            const { userid, firstname, lastname, admin } = user;
            res.json({ success: true, message: 'Login successful', user: { userid, firstname, lastname, admin } });
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

//post query to delete a user based on the input of a user's id
app.post('/api/deleteUser', async(req,res)=>{
    const { item: userid } = req.body.input;
    console.log(userid);
    const query = 'DELETE FROM users WHERE userid = :userid';
    try{
    const [deleteUser, metadata] = await sequelize.query(query, {
        replacements: { userid:userid },
        type: QueryTypes.DELETE
    });
    if(deleteUser){
        res.status(200).send({ message: 'User deleted successfully.' });
    } else {
        res.status(404).send({ error: 'User not found.' });
    }
    } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send({ error: 'An error occurred while deleting the user.' });
    }
});


//post query to create a new user ased on the specified input
app.post('/api/addUser', async(req,res)=>{
    const { userid, firstname,lastname, password } = req.body;
    console.log(userid, firstname, lastname,password);
    const query = 'INSERT INTO users (userid, firstname, lastname, password)\n' +
        `VALUES ('${userid}', '${firstname}', '${lastname}', '${password}')`;
    try{
        const [addUser, metadata] = await sequelize.query(query, {
            replacements: { userid,firstname,lastname,password },
            type: QueryTypes.INSERT
        });
        if(addUser){
            res.status(200).send({ message: 'User added successfully.' });
        } else {
            res.status(404).send({ error: 'User not found.' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ error: 'An error occurred while adding the user.' });
    }
});

//backend post query to add a print log everytime a user prints a label
app.post('/api/addLog', async(req,res)=>{
    const { userid, time_printed,date_printed, print_station } = req.body;
    console.log(userid, time_printed, date_printed,print_station);
    const query = 'INSERT INTO printer_logs (userid, time_printed, date_printed, print_station)\n' +
        `VALUES ('${userid}' , '${time_printed}', '${date_printed}', '${print_station}');`
    try {
        const [addLog, metadata] = await sequelize.query(query, {
            replacements: {userid, time_printed, date_printed, print_station},
            type: QueryTypes.INSERT
        });
        if (addLog) {
            res.json({
                success: true,
                message: 'Print Log successful',
                addLog: {userid, time_printed, date_printed, print_station}
            });
        } else {
            res.status(404).send({error: 'print log unsuccessful'});
        }
    }catch (error) {
        console.error('Error adding logs', error);
        res.status(500).send({ error: 'An error occurred while adding the printer log.' });
    }
});


//backend query to pull in all existing print logs from the database
app.post('/api/printLog', async(req,res)=>{
    const query = `select * from printer_logs;`;
    try{
        const logs = await printer_logs.findAll({
            attributes: ['userid','date_printed', 'time_printed', 'print_station']
        });
         console.log("Logs: ", logs);

        if(logs){
            res.status(200).send({ message: 'printer logs found', logs });

        } else {
            res.status(404).send({ error: 'logs not found.' });
        }

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ error: 'An error occurred while getting the logs' });
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

//backend query that joins the mes wip info table to the mes bom compnonents in order to determine a parts
//model number
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
        if (model) {
            res.json({ success: true, data: model });
        } else {
            res.status(404).json({ error: 'Model not found' });
        }
    } catch (error) {
        console.error('Error fetching model number:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/firstFit', async (req,res) => {
        const serial = req.query.serial;
        const id21 = req.query.id21;
        try {
            // Query database
            const query = 
            `SELECT bom."COMPONENT_ITEM_NUMBER", wip."MODEL_NUMBER", bom."COMMODITY_TYPE"
            FROM mes_assy_job_info AS assy
            INNER JOIN mes_bom_components AS bom ON assy."ID21_ITEM_NUMBER" = bom."ID21_ITEM_NUMBER"
            INNER JOIN mes_wip_info AS wip ON bom."WIP_JOB_NUMBER" = wip."WIP_JOB_NUMBER"
            WHERE (bom."COMMODITY_TYPE" = 'TURBINE HOUSING' OR bom."COMMODITY_TYPE" = 'COMPRESSOR HOUSING' OR bom."COMMODITY_TYPE" = 'SHROUD') AND assy."SERIAL_NUMBER" = :serial AND bom."ID21_ITEM_NUMBER" = :id21
            ORDER BY bom."COMMODITY_TYPE" ASC`;
            const data = [] = await sequelize.query(query, {
                replacements: {serial:serial, id21:id21},
                type:QueryTypes.SELECT,
                raw:true,
            });
            if (data) {
                //success
                let turbine, compressor;
                let shroud = false;
                data.forEach(element => {
                    console.log(element);
                    switch (element.COMMODITY_TYPE){
                        case 'TURBINE HOUSING':
                            turbine = element;
                            break;
                        case 'COMPRESSOR HOUSING':
                            compressor = element;
                            break;
                        case 'SHROUD':
                            shroud = element;
                            break;
                    }
                });
                res.json({ success: true, message: 'Query successful', compressor:compressor, shroud:shroud, turbine:turbine });
            } else {
                // No entries with the specified part number
                res.status(401).json({ success: false, message: 'Invalid ID21 or Serial Number'});
            }
        } catch (error) {
            console.error('Error executing query', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
});

app.get('/api/getDropdown', async (req,res) => {
    const component = `${req.query.component}%`;
    console.log("component ",component);
    try{
        const query = 
        `SELECT DISTINCT "COMPONENT_ITEM_NUMBER", "COMMODITY_TYPE" 
        FROM mes_bom_components 
        WHERE "COMPONENT_ITEM_NUMBER" LIKE :component 
        AND ("COMMODITY_TYPE" = 'TURBINE HOUSING' OR "COMMODITY_TYPE" = 'COMPRESSOR HOUSING')`;
        const dropdown = [] = await sequelize.query(query, {
            replacements:{component: component},
            type:QueryTypes.SELECT,
            raw:true,
        });
        if(dropdown.length > 0){
            //success
            res.json({ success: true, message: 'Query successful', dropdown:dropdown });
        } else {
            // No entries match the search
            res.status(401).json({ success: false, message: 'Invalid Search'});
        }
    } catch{
        console.error('Error executing query');
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
app.get('/api/getTeardown', async (req,res)=>{
    const component = `${req.query.component}%`;
    console.log("component ",component);
    try{
        const query =
            `select distinct   "COMPONENT_ITEM_NUMBER"
             from
                 mes_bom_components
             where
                 "COMPONENT_ITEM_NUMBER" like :component`;
        const dropdown = [] = await sequelize.query(query, {
            replacements:{component: component},
            type:QueryTypes.SELECT,
            raw:true,
        });
        if(dropdown.length > 0){
            //success
            res.json({ success: true, message: 'Query successful', dropdown:dropdown });
        } else {
            // No entries match the search
            res.status(401).json({ success: false, message: 'Invalid Search'});
        }
    } catch{
        console.error('Error executing query');
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
//ensure that the port is working
app.listen(8080, () => {
    console.log('server listening on port 8080');
});
