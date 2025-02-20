const admin = require('../config/firebase-admin');

const validateRequest = (req, res, next) => {
    // Implement request validation logic here
    next();
};

const authenticateUser = async (req, res, next) => {
    try {
        console.log('Checking authentication...');
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('No token provided');
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        const token = authHeader.split('Bearer ')[1];
        console.log('Token received:', token.substring(0, 20) + '...');
        
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            console.log('Token verified, user:', decodedToken.uid);
            req.user = decodedToken;
            next();
        } catch (error) {
            console.log('Token verification failed:', error.message);
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const logRequest = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

module.exports = {
    validateRequest,
    authenticateUser,
    logRequest
};