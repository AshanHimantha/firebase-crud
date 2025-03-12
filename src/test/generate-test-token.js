const admin = require('../config/firebase-admin');

async function generateTestToken() {
    try {
        const uid = 'test-user-id';
        const customClaims = {
            role: 'admin'
        };
        
        const token = await admin.auth().createCustomToken(uid, customClaims);
        console.log('Test token:', token);
    } catch (error) {
        console.error('Error generating token:', error);
    }
}

generateTestToken();