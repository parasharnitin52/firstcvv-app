const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

let sequelize;

// Connection options
const commonOptions = {
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

// Add SSL options for production
if (process.env.NODE_ENV === 'production') {
    commonOptions.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    };
}

if (process.env.DATABASE_URL) {
    // Use full connection string (Supabase pooler - IPv4 compatible)
    sequelize = new Sequelize(process.env.DATABASE_URL, commonOptions);
} else {
    // Fallback to individual env vars (local development)
    sequelize = new Sequelize(
        process.env.DB_NAME || 'firstcv',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || 'postgres',
        {
            ...commonOptions,
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432
        }
    );
}

module.exports = sequelize;
