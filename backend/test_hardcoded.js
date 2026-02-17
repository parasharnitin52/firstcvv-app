const { Sequelize } = require('sequelize');

const password = 'nitin@52';

async function check() {
    console.log(`Testing hardcoded password: '${password}'`);
    const sequelize = new Sequelize('firstcv', 'postgres', password, {
        host: 'localhost',
        dialect: 'postgres',
        logging: false
    });

    try {
        await sequelize.authenticate();
        console.log(`✅ SUCCESS! Connection established.`);
    } catch (error) {
        console.error(`❌ Failed: ${error.message}`);
        console.error(`Original Error:`, error);
    } finally {
        await sequelize.close();
    }
}

check();
