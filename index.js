const dotenv = require('dotenv');
dotenv.config(); // Load env vars first

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const blogRoutes = require('./routes/blog');
const uploadRoutes = require('./routes/upload');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.DB_PORT;

const activityTracker = require('./middleware/activityTracker');
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// We need a way to identify the user. 
// If we use a global auth middleware that sets req.user, we can put activityTracker after it.
// However, the current setup seems to have auth inside routes.
// We can add a middleware that decodes token without enforcing auth, just for tracking?
// Or we just add it to the routes we care about.
// For simplicity, let's add a global middleware that tries to decode token if present.

const jwt = require('jsonwebtoken');
app.use(async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.user ? decoded.user.id : decoded.id; // Handle different payload structures

            // Fetch fresh user data
            const user = await require('./models').User.findByPk(userId);
            if (user) {
                req.user = user; // Attach Sequelize instance (has .role, .id etc)
            } else {
                req.user = decoded.user || decoded; // Fallback (shouldn't happen if user exists)
            }
        } catch (e) {
            console.error("Token verification failed:", e.message);
        }
    }
    next();
});

app.use(activityTracker);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/coupons', require('./routes/coupons'));
// app.use('/api/upload', uploadRoutes); // Deprecated

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Database Sync & Server Start
sequelize.sync() // Removed { alter: true } to prevent sync errors after manual migration
    .then(() => {
        console.log('Database connected and synced');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log("--- Config Check ---");
            console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID ? "Loaded (" + process.env.RAZORPAY_KEY_ID.substring(0, 5) + "...)" : "MISSING");
            console.log("Razorpay Secret:", process.env.RAZORPAY_KEY_SECRET ? "Loaded" : "MISSING");
            console.log("--------------------");
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
