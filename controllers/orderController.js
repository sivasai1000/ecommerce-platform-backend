const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Order, User, OrderItem, Product } = require('../models');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn("WARNING: Razorpay keys are missing in server .env file");
}

exports.getAllOrders = async (req, res) => {
    try {
        // Fetch fresh user data from DB to ensure role is up-to-date (avoids stale token issues)
        const user = await User.findByPk(req.user.id);

        let whereClause = {};

        // If NOT admin, scope to user. If admin, show all (empty whereClause)
        const isAdmin = user && (user.role === 'admin' || user.role === 'Admin');

        if (!isAdmin) {
            whereClause = { userId: req.user.id };
        }

        const orders = await Order.findAll({
            where: whereClause,
            include: [
                { model: User, attributes: ['name', 'email'] },
                {
                    model: OrderItem,
                    include: [{ model: Product, attributes: ['name', 'price', 'imageUrl'] }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error fetching orders' });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const options = {
            amount: Math.round(req.body.amount * 100), // amount in smallest currency unit
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: "Failed to create order", error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        console.log("Verify Payment Body:", req.body);
        console.log("User:", req.user);

        if (!req.user || !req.user.id) {
            console.error("User not authenticated in verifyPayment");
            return res.status(401).json({ message: "User not authenticated" });
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            cartItems,
            totalAmount,
            address
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        console.log("--- Razorpay Verification Debug ---");
        console.log("Received Signature:", razorpay_signature);
        console.log("Computed Signature:", expectedSignature);
        console.log("Match:", isAuthentic);
        console.log("-----------------------------------");

        if (isAuthentic) {
            try {
                // Save Order to Database
                console.log("Creating Order for User:", req.user.id);
                const newOrder = await Order.create({
                    userId: req.user.id,
                    totalAmount: totalAmount,
                    status: 'completed',
                    paymentId: razorpay_payment_id,
                    address: address
                });
                console.log("Order Created:", newOrder.id);

                // Save Order Items
                const orderItems = cartItems.map(item => ({
                    orderId: newOrder.id,
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                }));

                console.log("Creating Order Items:", orderItems.length);
                await OrderItem.bulkCreate(orderItems);
                console.log("Order Items Created");

                res.json({
                    message: "success",
                    orderId: newOrder.id
                });
            } catch (dbError) {
                console.error("Database Error during Order Creation:", dbError);
                res.status(500).json({ message: "Database Error", error: dbError.message });
            }
        } else {
            res.status(400).json({
                message: "failure",
            });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
