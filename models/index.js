const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Blog = require('./Blog');
const Wishlist = require('./Wishlist');
const Coupon = require('./Coupon');

// User - Order
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// User - Wishlist
User.hasMany(Wishlist, { foreignKey: 'userId' });
Wishlist.belongsTo(User, { foreignKey: 'userId' });

// Product - Wishlist
Product.hasMany(Wishlist, { foreignKey: 'productId' });
Wishlist.belongsTo(Product, { foreignKey: 'productId' });

// Product - User (addedBy)
Product.belongsTo(User, { as: 'creator', foreignKey: 'addedBy' });
User.hasMany(Product, { foreignKey: 'addedBy' });

// Order - OrderItem
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// Product - OrderItem
Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
    sequelize,
    User,
    Product,
    Order,
    OrderItem,
    Blog,
    Wishlist,
    Coupon,
};
