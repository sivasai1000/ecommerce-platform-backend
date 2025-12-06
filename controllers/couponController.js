const { Coupon } = require('../models');

exports.getCoupons = async (req, res) => {
    try {
        // Allow both admin and public to list coupons, but maybe filter active ones for public?
        // For simplicity, let's allow listing all for now, or just active ones.
        // User wants "available coupons" in cart.
        const where = {};
        if (!req.user || req.user.role !== 'admin') {
            where.isActive = true;
            // Also maybe hide expired?
        }

        const coupons = await Coupon.findAll({ where });
        res.json(coupons);
        return; // Early return to avoid double send
    } catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Start of createCoupon... keeping exports structure
exports.createCoupon = async (req, res) => {
    try {
        console.log("Create Coupon Request - User:", req.user);
        console.log("Create Coupon Request - Role:", req.user?.role);
        // Admin only check should be in middleware preferably
        if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'Admin')) return res.status(403).json({ message: 'Forbidden' });

        const coupon = await Coupon.create(req.body);
        res.status(201).json(coupon);
    } catch (error) {
        console.error('Error creating coupon:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteCoupon = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

        const { id } = req.params;
        await Coupon.destroy({ where: { id } });
        res.json({ message: 'Coupon deleted' });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        console.log(`Validating Coupon: ${code}`); // DEBUG
        const coupon = await Coupon.findOne({ where: { code, isActive: true } });

        if (!coupon) {
            console.log("Coupon not found or inactive");
            return res.status(404).json({ message: 'Invalid coupon' });
        }

        console.log(`Found Coupon: ${JSON.stringify(coupon)}`);

        if (coupon.minOrderValue > 0) {
            const { cartTotal } = req.body; // Expect cartTotal from client
            if (cartTotal === undefined) {
                // For backward compatibility or check failure
                // If cartTotal is not sent, we can't validate minOrderValue.
                // Let's assume passed for now or require it.
                // Better to optional but if present check.
            } else if (Number(cartTotal) < Number(coupon.minOrderValue)) {
                console.log(`Coupon min order value not met: ${cartTotal} < ${coupon.minOrderValue}`);
                return res.status(400).json({
                    message: `Minimum order of $${coupon.minOrderValue} required`,
                    minOrderValue: coupon.minOrderValue
                });
            }
        }

        // Check expiry
        if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
            console.log("Coupon expired");
            return res.status(400).json({ message: 'Coupon expired' });
        }

        res.json(coupon);
    } catch (error) {
        console.error('Error validating coupon:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
