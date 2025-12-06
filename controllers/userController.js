const { User } = require('../models');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
};

exports.toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isActive = isActive;
        await user.save();

        res.json({ message: 'User status updated', user: { id: user.id, isActive: user.isActive } });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
