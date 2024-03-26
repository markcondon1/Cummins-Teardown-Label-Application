const sequelize = require('./database/sequelize'); // Import Sequelize instance

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        sequelize.close(); // Close the connection after testing
    }
}

testConnection();
