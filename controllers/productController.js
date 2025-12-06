const { Product } = require('../models');
const sequelize = require('../config/database');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{
                model: require('../models').User,
                as: 'creator',
                attributes: ['id', 'name', 'email']
            }]
        });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error fetching products' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{
                model: require('../models').User,
                as: 'creator',
                attributes: ['id', 'name', 'email']
            }]
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error fetching product' });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Product.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
            raw: true
        });
        const categoryList = categories.map(c => c.category).filter(Boolean); // Filter out null/empty
        res.json(categoryList);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error fetching categories' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const productData = { ...req.body };
        if (productData.price) productData.price = parseFloat(productData.price);
        if (productData.mrp) productData.mrp = parseFloat(productData.mrp);
        if (productData.stock) productData.stock = parseInt(productData.stock);
        if (productData.discount) productData.discount = parseInt(productData.discount);

        if (req.user) {
            productData.addedBy = req.user.id;
        }

        if (req.file) {
            // If using local storage, construct full URL
            if (!req.file.path.startsWith('http')) {
                productData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
            } else {
                productData.imageUrl = req.file.path; // Cloudinary URL
            }
        }

        const product = await Product.create(productData);
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error creating product' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const productData = { ...req.body };
        // Parse numeric fields from FormData strings
        if (productData.price) productData.price = parseFloat(productData.price);
        if (productData.mrp) productData.mrp = parseFloat(productData.mrp);
        if (productData.stock) productData.stock = parseInt(productData.stock);

        if (req.file) {
            // If using local storage, construct full URL
            if (!req.file.path.startsWith('http')) {
                productData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
            } else {
                productData.imageUrl = req.file.path; // Cloudinary URL
            }
        }

        await product.update(productData);
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error updating product' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.destroy();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error deleting product' });
    }
};

exports.getFamousProducts = async (req, res) => {
    try {
        const { OrderItem } = require('../models');

        // Find top selling products by aggregating sum of quantity from OrderItems
        const topProducts = await OrderItem.findAll({
            attributes: [
                'productId',
                [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold']
            ],
            group: ['productId'],
            order: [[sequelize.literal('totalSold'), 'DESC']],
            limit: 8,
            include: [{
                model: Product,
                attributes: ['id', 'name', 'price', 'mrp', 'imageUrl', 'category', 'description', 'discount']
            }]
        });

        // Extract Product data from the result
        const products = topProducts.map(item => item.Product).filter(Boolean);

        res.json(products);
    } catch (error) {
        console.error('Error fetching famous products:', error);
        res.status(500).json({ message: 'Server error fetching famous products' });
    }
};

exports.getDeals = async (req, res) => {
    try {
        const { Op } = require('sequelize');
        const products = await Product.findAll({
            where: {
                discount: {
                    [Op.gt]: 0
                }
            },
            order: [['discount', 'DESC']]
        });
        res.json(products);
    } catch (error) {
        console.error('Error fetching deals:', error);
        res.status(500).json({ message: 'Server error fetching deals' });
    }
};
