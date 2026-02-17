const { Sequelize } = require('sequelize');

const passwords = [
    'postgres',
    'password',
    'admin',
    '123456',
    'root',
    ''
];

async function check(password) {
    console.log(`Testing password: '${password}'`);
    const sequelize = new Sequelize('firstcv', 'postgres', password, {
        host: 'localhost',
        dialect: 'postgres',
        logging: false
    });

    try {
        await sequelize.authenticate();
        console.log(`✅ SUCCESS! Password is: '${password}'`);
        sequelize.close();
        return true;
    } catch (error) {
        console.log(`❌ Failed: ${error.message}`);
        sequelize.close();
        return false;
    }
}

async function run() {
    for (const p of passwords) {
        if (await check(p)) {
            process.exit(0);
        }
    }
    console.log('❌ All attempts failed.');
    process.exit(1);
}

run();
