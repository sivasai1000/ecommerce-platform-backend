const { User } = require('./models');
const sequelize = require('./config/database');

async function promoteToAdmin() {
    try {
        await sequelize.authenticate();
        // Update functionality: find user by name Sanju or just update ID 1
        const [updated] = await User.update({ role: 'admin' }, {
            where: { name: 'Sanju' }
        });

        if (updated > 0) {
            console.log("Successfully promoted 'Sanju' to admin.");
        } else {
            console.log("User 'Sanju' not found. Promoting all users to admin for dev purposes.");
            await User.update({ role: 'admin' }, { where: {} });
            console.log("All users promoted to admin.");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await sequelize.close();
    }
}

promoteToAdmin();
