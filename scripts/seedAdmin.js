const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { User, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        await sequelize.sync();

        const adminEmail = 'admin@example.com';
        const adminPassword = 'admin'; // Simple password for development
        const adminName = 'Admin User';

        // Check if admin exists
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });
        if (existingAdmin) {
            console.log('Admin user already exists.');
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Create Admin
        await User.create({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
        });

        console.log(`Admin user created successfully.`);
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await sequelize.close();
    }
};

seedAdmin();
