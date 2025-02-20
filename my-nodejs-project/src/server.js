const express = require('express');
const itemRoutes = require('./routes/item.routes');
const productRoutes = require('./routes/product.routes');
const { logRequest } = require('./middleware');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(logRequest);

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/products', productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});