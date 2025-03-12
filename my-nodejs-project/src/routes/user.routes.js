const express = require('express');
const router = express.Router();
const admin = require('../config/firebase-admin');
const { authenticateUser } = require('../middleware');

// Protect all user routes
router.use(authenticateUser);

// Get current user data
router.get('/me', async (req, res) => {
  try {
    // req.user contains the decoded token from the middleware
    const uid = req.user.uid;
    
    // Get additional user data from Firebase Auth
    const userRecord = await admin.auth().getUser(uid);
    
    // Return user data
    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      phoneNumber: userRecord.phoneNumber,
      disabled: userRecord.disabled,
      metadata: {
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime
      },
      customClaims: userRecord.customClaims || {}
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to retrieve user data' });
  }
});

// Get user profile from Firestore (if you store additional data)
router.get('/profile', async (req, res) => {
  try {
    const uid = req.user.uid;
    
    // Get user data from Firestore if you store additional profile data there
    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    
    res.json({
      uid: uid,
      ...userDoc.data()
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
});

module.exports = router;