const { Blog } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

exports.getAllBlogs = async (req, res) => {
    try {
        const { q, category } = req.query;
        const whereClause = {};

        if (q) {
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${q}%` } },
                { content: { [Op.like]: `%${q}%` } }
            ];
        }

        if (category) {
            whereClause.category = category;
        }

        const blogs = await Blog.findAll({ where: whereClause, order: [['createdAt', 'DESC']] });
        res.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Server error fetching blogs' });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ message: 'Server error fetching blog' });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Blog.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
            raw: true
        });
        const categoryList = categories.map(c => c.category).filter(Boolean);
        res.json(categoryList);
    } catch (error) {
        console.error('Error fetching blog categories:', error);
        res.status(500).json({ message: 'Server error fetching blog categories' });
    }
};

exports.createBlog = async (req, res) => {
    try {
        const blogData = { ...req.body };

        if (req.file) {
            // If using local storage, construct full URL
            if (!req.file.path.startsWith('http')) {
                blogData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
            } else {
                blogData.imageUrl = req.file.path; // Cloudinary URL
            }
        }

        const blog = await Blog.create(blogData);
        res.status(201).json(blog);
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Server error creating blog' });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const blogData = { ...req.body };

        if (req.file) {
            // If using local storage, construct full URL
            if (!req.file.path.startsWith('http')) {
                blogData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
            } else {
                blogData.imageUrl = req.file.path; // Cloudinary URL
            }
        }

        await blog.update(blogData);
        res.json(blog);
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'Server error updating blog' });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        await blog.destroy();
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Server error deleting blog' });
    }
};
