const { Coupon } = require('./models');
const sequelize = require('./config/database');

async function listCoupons() {
    try {
        await sequelize.authenticate();
        const coupons = await Coupon.findAll();
        coupons.forEach(c => {
            console.log(JSON.stringify(c.toJSON()));
        });
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await sequelize.close();
    }
}

listCoupons();
