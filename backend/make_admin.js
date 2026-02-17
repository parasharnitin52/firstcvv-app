// Run: node make_admin.js <email>
// Promotes a user to admin role
require('dotenv').config();
const sequelize = require('./config/database');
const User = require('./models/User');

const email = process.argv[2];

if (!email) {
    console.log('Usage: node make_admin.js <email>');
    process.exit(1);
}

(async () => {
    try {
        await sequelize.authenticate();
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log(`❌ User with email "${email}" not found.`);
            process.exit(1);
        }
        user.role = 'admin';
        await user.save();
        console.log(`✅ User "${user.name}" (${email}) is now an admin!`);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
})();
