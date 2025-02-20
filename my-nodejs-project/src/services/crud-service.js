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

const collectionName = 'user';

class CrudService {
  async create(data) {
    try {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, data);
      return { id: docRef.id, ...data };
    } catch (error) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  async getAll() {
    try {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Error getting documents: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      throw new Error(`Error getting document: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
      return { id, ...data };
    } catch (error) {
      throw new Error(`Error updating document: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw new Error(`Error deleting document: ${error.message}`);
    }
  }
}

module.exports = new CrudService();