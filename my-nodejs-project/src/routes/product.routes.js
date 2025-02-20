const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware');
const { db } = require('../config/firebase-config');
const {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} = require('firebase/firestore');

const COLLECTION_NAME = 'products';

// Protect all routes with authentication
router.use(authenticateUser);

// Create Product
router.post('/', async (req, res) => {
  try {
    const collectionRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(collectionRef, {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      stock: req.body.stock,
      category: req.body.category,
      createdAt: new Date().toISOString()
    });
    res.status(201).json({ id: docRef.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Products
router.get('/', async (req, res) => {
  try {
    const collectionRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(collectionRef);
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Product by ID
router.get('/:id', async (req, res) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, req.params.id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Product
router.put('/:id', async (req, res) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, req.params.id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await updateDoc(docRef, {
      ...req.body,
      updatedAt: new Date().toISOString()
    });
    
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Product
router.delete('/:id', async (req, res) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, req.params.id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await deleteDoc(docRef);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add this route after other routes
router.get('/test/auth', async (req, res) => {
  try {
    // This will only execute if authentication was successful
    res.json({
      message: 'Authentication successful',
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;