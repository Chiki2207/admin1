require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false 
    }
);

// Test the connection
sequelize.authenticate()
    .then(() => console.log('Conexión a MySQL establecida'))
    .catch(err => console.error('Error conectando a MySQL:', err));

module.exports = sequelize;
