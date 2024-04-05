const { Sequelize } = require('sequelize');
require('dotenv').config();
console.log(process.env);

const sequelize = new Sequelize(`postgres://${process.env.REACT_APP_USER}:${process.env.REACT_APP_PASSWORD}@${process.env.REACT_APP_HOST}:5432/postgres`)

module.exports = sequelize;