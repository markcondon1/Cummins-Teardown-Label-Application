const { Sequelize } = require('sequelize');

require('dotenv').config();

console.log(process.env);
// const pool = new Pool({
//     user: 'postgres.paixptuglhwecgkdjfwm',
//     host:                                                                        'aws-0-us-east-1.pooler.supabase.com',
//     database: 'postgres',
//     password: 'CumminsTLA_Pass',
//     port: 5432,
// });

const sequelize = new Sequelize(`postgres://${process.env.REACT_APP_USER}:${process.env.REACT_APP_PASSWORD}@${process.env.REACT_APP_HOST}:5432/postgres`)

module.exports = sequelize;