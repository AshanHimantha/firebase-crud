const admin = require('../config/firebase-admin');

const validateRequest = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} request to ${req.originalUrl}`);
    
    // Add basic request validation
    if (req.method === 'POST' && !req.body) {
        return res.status(400).json({ error: 'Request body is required' });
    }
    
    next();
};

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({ error: 'Authentication token is required' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Attach the decoded token to the request object
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(403).json({ error: 'Invalid token' });
    }
};

module.exports = {
    validateRequest,
    authenticateToken
};