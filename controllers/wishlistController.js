const { Wishlist, Product, User } = require('../models');

exports.getWishlist = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const wishlist = await Wishlist.findAll({
            where: { userId: req.user.id },
            include: [{ model: Product }]
        });
        res.json(wishlist);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { productId } = req.body;

        const exists = await Wishlist.findOne({
            where: { userId: req.user.id, productId }
        });

        if (exists) {
            return res.status(400).json({ message: 'Item already in wishlist' });
        }

        const item = await Wishlist.create({
            userId: req.user.id,
            productId
        });

        // Fetch full product details to return
        const fullItem = await Wishlist.findByPk(item.id, {
            include: [{ model: Product }]
        });

        res.status(201).json(fullItem);
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { productId } = req.params;

        await Wishlist.destroy({
            where: { userId: req.user.id, productId }
        });

        res.json({ message: 'Device removed from wishlist' });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
