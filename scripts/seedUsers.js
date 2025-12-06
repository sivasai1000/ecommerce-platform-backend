const { User } = require('../models');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const seedUsers = async () => {
    try {
        await sequelize.sync();

        const users = [
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'user'
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'password123',
                role: 'user'
            },
            {
                name: 'Alice Johnson',
                email: 'alice@example.com',
                password: 'password123',
                role: 'user'
            }
        ];

        for (const user of users) {
            const existingUser = await User.findOne({ where: { email: user.email } });
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await User.create({ ...user, password: hashedPassword });
                console.log(`User ${user.name} created`);
            } else {
                console.log(`User ${user.name} already exists`);
            }
        }

        console.log('User seeding completed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
