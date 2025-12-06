const { User } = require('./models');
require('dotenv').config();

async function checkUsers() {
    try {
        const users = await User.findAll({
            where: {
                id: [1, 6]
            }
        });
        console.log(JSON.stringify(users.map(u => ({ id: u.id, name: u.name, role: u.role })), null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
}

checkUsers();
