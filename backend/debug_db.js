const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

// Explicitly load .env
const result = dotenv.config();

console.log('--- Environment Check ---');
if (result.error) {
    console.log('Basic env loading failed:', result.error.message);
} else {
    console.log('.env file found and parsed');
}

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
// Mask password
const pass = process.env.DB_PASSWORD;
console.log('DB_PASSWORD length:', pass ? pass.length : 'undefined');
console.log('DB_PASSWORD first char:', pass ? pass[0] : 'N/A');

console.log('\n--- Connection Attempt ---');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection successful!');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        if (error.original) {
            console.error('Original Code:', error.original.code);
            console.error('Original Message:', error.original.message);
        }
    } finally {
        await sequelize.close();
    }
}

testConnection();
