const { User } = require('./models');
const sequelize = require('./config/database');

async function checkUsers() {
    try {
        await sequelize.authenticate();
        const users = await User.findAll({
            attributes: ['id', 'email', 'role', 'name']
        });
        console.log("--- Users ---");
        users.forEach(u => {
            console.log(`ID: ${u.id}, Name: ${u.name}, Email: ${u.email}, Role: '${u.role}'`);
        });
        console.log("-------------");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await sequelize.close();
    }
}

checkUsers();
