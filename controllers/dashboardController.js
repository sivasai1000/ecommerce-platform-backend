const { Order, User, Product } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
    try {
        // Total Revenue
        const totalRevenue = await Order.sum('totalAmount');

        // Active Users (Total users for now)
        const activeUsers = await User.count();

        // Total Products
        const totalProducts = await Product.count();

        // Recent Orders
        const recentOrders = await Order.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{ model: User, attributes: ['name', 'email'] }]
        });

        // Active Now (Users active in last 5 minutes)
        const fiveMinutesAgo = new Date(new Date() - 5 * 60 * 1000);
        const activeNow = await User.count({
            where: {
                lastActiveAt: {
                    [Op.gte]: fiveMinutesAgo
                }
            }
        });

        res.json({
            totalRevenue: totalRevenue || 0,
            activeUsers,
            totalProducts,
            activeNow,
            recentOrders
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error fetching dashboard stats' });
    }
};
