const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('postgres://postgres.paixptuglhwecgkdjfwm:CumminsTLA_Pass@aws-0-us-east-1.pooler.supabase.com:5432/postgres')

module.exports = sequelize;