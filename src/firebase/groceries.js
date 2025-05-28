import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, getDoc, setDoc } from "firebase/firestore"; 
import { app } from './firebase';

const db = getFirestore(app);

const getUserPantry = async (userId) => {
    const pantryRef = doc(db, `users/${userId}/itemList/pantry`);
    const pantrySnapshot = await getDoc(pantryRef);
    
    if (!pantrySnapshot.exists()) {
        // Create an empty pantry document if it doesn't exist
        await setDoc(pantryRef, { items: [] });
        return { items: [] };
    }

    return { ...pantrySnapshot.data() };
};

export const getPantryItems = async (userId) => {
    const pantry = await getUserPantry(userId);
    return pantry ? pantry.items : [];
};

export const addItemsToPantry = async (userId, items) => {
    if (!items || items.length === 0) return;
    
    const userRef = doc(db, `users/${userId}`);
    const userSnapshot = await getDoc(userRef);
    
    if (!userSnapshot.exists()) {
        console.error("User not found");
        return null;
    }
    
    const userData = userSnapshot.data();
    let nextItemId = userData.nextItemId || 0;
    let itemCardinality = userData.itemCardinality || 0;
    
    const pantry = await getUserPantry(userId);
    const pantryRef = doc(db, `users/${userId}/itemList/pantry`);
    
    // Add IDs to new items
    const itemsWithIds = items.map(item => {
        const newItem = { ...item, id: nextItemId++ };
        return newItem;
    });
    
    // Update user's itemCardinality and nextItemId
    await updateDoc(userRef, { 
        itemCardinality: itemCardinality + items.length, 
        nextItemId: nextItemId 
    });
    
    // Update pantry with new items
    const updatedItems = [...(pantry.items || []), ...itemsWithIds];
    await updateDoc(pantryRef, { items: updatedItems });
    
    return { ...pantry, items: updatedItems };
};

export const updatePantryItem = async (userId, item) => {
    if (!item || !item.id) return null;
    
    const pantry = await getUserPantry(userId);
    if (!pantry || !pantry.items) return null;

    const pantryRef = doc(db, `users/${userId}/itemList/pantry`);
    const updatedItems = pantry.items.map(i => i.id === item.id ? item : i);

    await updateDoc(pantryRef, { items: updatedItems });
    return { ...pantry, items: updatedItems };
};

export const removeItemFromPantry = async (userId, item) => {
    if (!item || !item.id) return null;
    
    const userRef = doc(db, `users/${userId}`);
    const userSnapshot = await getDoc(userRef);
    
    if (!userSnapshot.exists()) {
        console.error("User not found");
        return null;
    }
    
    const userData = userSnapshot.data();
    const itemCardinality = userData.itemCardinality || 0;

    // Update user's itemCardinality
    await updateDoc(userRef, { itemCardinality: Math.max(0, itemCardinality - 1) });
    
    const pantry = await getUserPantry(userId);
    if (!pantry || !pantry.items) return null;

    const pantryRef = doc(db, `users/${userId}/itemList/pantry`);
    const updatedItems = pantry.items.filter(i => i.id !== item.id);

    await updateDoc(pantryRef, { items: updatedItems });
    return { ...pantry, items: updatedItems };
};
