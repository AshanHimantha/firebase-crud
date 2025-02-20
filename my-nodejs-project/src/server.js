const express = require('express');
const itemRoutes = require('./routes/item.routes');
const productRoutes = require('./routes/product.routes');
const { logRequest } = require('./middleware');
const { validateRequest, authenticateToken } = require('./middleware/route.middleware');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(logRequest);

// Routes with middleware
app.use('/api/items', validateRequest, authenticateToken, itemRoutes);
app.use('/api/products', validateRequest, authenticateToken, productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});