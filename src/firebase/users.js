import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"; 
import { app } from './firebase';

const db = getFirestore(app);

export const createUser = async (userId, email, name) => {
    try {
        // Check if user already exists
        const userRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userRef);
        
        if (!userSnapshot.exists()) {
            // Create new user document
            await setDoc(userRef, {
                userId, 
                name, 
                email, 
                itemCardinality: 0,
                nextItemId: 0,
                createdAt: new Date()
            });
            
            // Create empty pantry document
            const pantryRef = doc(db, `users/${userId}/itemList/pantry`);
            await setDoc(pantryRef, { items: [] });
        }
        
        return { userId, email, name };
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

export const getUser = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userRef);
        
        if (userSnapshot.exists()) {
            return userSnapshot.data();
        }
        
        return null;
    } catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
}