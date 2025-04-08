import {
    addDoc,
    collection,
    getDocs,
    query,
    where
} from 'firebase/firestore';
import db from '../firebase/firestore';
  
  
  export function useFirestore(collectionName) {
    const collectionRef = collection(db, collectionName);
  
    const add = async (data) => {
      try {
        const docRef = await addDoc(collectionRef, data);
        return { id: docRef.id, ...data };
      } catch (error) {
        console.error('Error adding document:', error);
        throw error;
      }
    };
  
    const getAll = async () => {
      try {
        const querySnapshot = await getDocs(collectionRef);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error getting documents:', error);
        throw error;
      }
    };
  
    const getByField = async (field, value) => {
      try {
        const q = query(collectionRef, where(field, '==', value));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error getting documents by field:', error);
        throw error;
      }
    };
  
    return {
      add,
      getAll,
      getByField
    };
  }