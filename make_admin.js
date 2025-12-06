const { User } = require('./models');
require('dotenv').config();

async function makeAdmin() {
    try {
        const user = await User.findByPk(1);
        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`User ${user.name} (ID: ${user.id}) promoted to ADMIN.`);
        } else {
            console.log("User 1 not found");
        }
    } catch (error) {
        console.error("Error updating user:", error);
    }
}

makeAdmin();
