const { Blog } = require('../models');
const sequelize = require('../config/database');

const seedBlogs = async () => {
    try {
        await sequelize.sync();

        const blogs = [
            {
                title: 'The Future of E-commerce',
                content: 'E-commerce is evolving rapidly with AI and AR technologies...',
                author: 'Admin User',
                category: 'Technology',
                imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800',
            },
            {
                title: 'Top 10 Gadgets of 2024',
                content: 'Here are the must-have gadgets for this year...',
                author: 'Tech Reviewer',
                category: 'Gadgets',
                imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
            },
            {
                title: 'Sustainable Shopping Habits',
                content: 'How to shop more sustainably and reduce your carbon footprint...',
                author: 'Eco Warrior',
                category: 'Lifestyle',
                imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
            }
        ];

        for (const blog of blogs) {
            await Blog.create(blog);
            console.log(`Blog "${blog.title}" created`);
        }

        console.log('Blog seeding completed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding blogs:', error);
        process.exit(1);
    }
};

seedBlogs();
