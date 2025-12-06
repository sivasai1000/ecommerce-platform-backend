const sequelize = require('./config/database');
const { QueryTypes } = require('sequelize');

async function migrate() {
    try {
        await sequelize.authenticate();
        console.log('Connected');
        // Check if column exists first? Or just try add.
        // MySQL doesn't have "IF NOT EXISTS" for ADD COLUMN easily in one line without procedure.
        // We'll just try and catch.
        await sequelize.query("ALTER TABLE Coupons ADD COLUMN minOrderValue DECIMAL(10, 2) NOT NULL DEFAULT 0;", { type: QueryTypes.RAW });
        console.log('Column added');
    } catch (e) {
        console.log('Migration message: ' + e.original?.sqlMessage || e.message);
    } finally {
        // await sequelize.close(); // Leaving open usually fine in script but clean up is good.
    }
}
migrate();
