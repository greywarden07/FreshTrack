/**
 * Storage Service (Scaffold)
 * 
 * This service will handle data storage for user items and receipts.
 * 
 * TODO Implementation steps:
 * 1. Set up a database:
 *    - Firebase Firestore
 *    - Or another database solution
 * 
 * 2. Implement data models:
 *    - User model
 *    - Receipt model
 *    - Food item model with expiry dates
 * 
 * 3. Implement CRUD operations:
 *    - Save new items
 *    - Retrieve user's items
 *    - Update item status
 *    - Delete expired items
 * 
 * 4. Implement image storage:
 *    - Store receipt images for reference
 *    - Implement efficient retrieval
 */
import { getPantryItems, addItemsToPantry, updatePantryItem, removeItemFromPantry } from "../firebase/groceries";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../firebase/firebase";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  writeBatch, 
  doc, 
  getDoc, 
  updateDoc 
} from "firebase/firestore";

// Initialize Firebase Storage
const storage = getStorage(app);
// Initialize Firestore
const db = getFirestore(app);

// Check if running in development
const isDevelopment = process.env.NODE_ENV === 'development';

// For local development testing when Firebase Storage has CORS issues
const saveImageToLocalStorage = (userId, imageFile) => {
  return new Promise((resolve) => {
    // We no longer store the entire image, just use its reference
    console.log('Using browser memory for temporary processing (not storing image)');
    resolve({
      imageUrl: 'memory-only', // We don't actually save the URL
      localStorageKey: `temp_${Date.now()}`,
      message: 'Receipt processed locally (Image not stored)'
    });
  });
};

const storageService = {
  // These are just placeholder functions
  // Implement actual database operations later
  
  saveItems: async (userId, purchaseDate, items) => {
    console.log('Storing items in the database:', items);

    const updatedItems = items.map(item => {
      return { purchaseDate, ...item };
    });

    return await addItemsToPantry(userId, updatedItems);
  },
  
  getItems: async (userId) => {
    console.log('Retrieving items from the database');
    return await getPantryItems(userId);
  },

  addItem: async (userId, purchaseDate, item) => {
    console.log('Adding item to the database:', item);
    const updatedItem = { purchaseDate, ...item };
    return await addItemsToPantry(userId, [updatedItem]);
  },

  editItem: async (userId, item) => {
    console.log('Editing item in the database:', item);
    return await updatePantryItem(userId, item);
  },

  deleteItem: async (userId, item) => {
    console.log('Deleting item from the database:', item);
    return await removeItemFromPantry(userId, item);
  },

  deleteAllItems: async (userId) => {
    console.log('Deleting all items for user:', userId);
    
    // Check for valid userId
    if (!userId) {
      console.error('Error: No user ID provided for deleteAllItems');
      return { success: false, message: 'No user ID provided' };
    }
    
    try {
      // We need to update the pantry document directly, since items are stored
      // in a single document at users/{userId}/itemList/pantry instead of
      // individual documents in a collection.
      console.log('Getting pantry document reference');
      const pantryRef = doc(db, `users/${userId}/itemList/pantry`);
      
      // Get the current pantry document
      const pantrySnapshot = await getDoc(pantryRef);
      
      if (!pantrySnapshot.exists()) {
        console.log('Pantry document does not exist');
        return { success: true, message: 'No items to delete' };
      }
      
      const pantryData = pantrySnapshot.data();
      const itemCount = pantryData?.items?.length || 0;
      
      console.log(`Found ${itemCount} items to delete`);
      
      if (itemCount === 0) {
        return { success: true, message: 'No items to delete' };
      }
      
      // Update the pantry document with an empty items array
      await updateDoc(pantryRef, { items: [] });
      
      // Also update the user's itemCardinality
      const userRef = doc(db, `users/${userId}`);
      await updateDoc(userRef, { itemCardinality: 0 });
      
      console.log(`Successfully deleted ${itemCount} items`);
      
      return { 
        success: true, 
        message: `Deleted ${itemCount} items successfully` 
      };
    } catch (error) {
      console.error('Error deleting all items:', error);
      
      // Provide detailed error information
      let errorDetails = '';
      if (error.code) {
        errorDetails += ` (Code: ${error.code})`;
      }
      if (error.message) {
        errorDetails += ` - ${error.message}`;
      }
      
      return { 
        success: false, 
        message: `Failed to delete items${errorDetails}`,
        error: error
      };
    }
  },

  modifyPurchaseDate: async (userId, items, purchaseDate) => {
    console.log('Modifying purchase date for items:', items);
    const updatePromises = items.map(item => {
      const updatedItem = { ...item, purchaseDate };
      return updatePantryItem(userId, updatedItem);
    });
    
    return Promise.all(updatePromises);
  },
  
  saveReceiptImage: async (userId, imageFile) => {
    console.log('Processing receipt image:', imageFile.name);
    
    // If in development and we want to use local storage for testing
    const useLocalStorageFallback = isDevelopment && localStorage.getItem('useLocalStorageFallback') === 'true';
    
    if (useLocalStorageFallback) {
      console.log('Using local processing instead of Firebase Storage');
      return saveImageToLocalStorage(userId, imageFile);
    }
    
    try {
      // Use a more reliable naming scheme for the file
      const safeFileName = encodeURIComponent(imageFile.name).replace(/%20/g, '_');
      const timestamp = Date.now();
      const fileRef = `receipts/${userId}/${timestamp}_${safeFileName}`;
      
      // In development mode, we can skip actual storage and just pretend we stored it
      if (isDevelopment) {
        console.log('Development mode: Skipping actual storage upload');
        return { 
          imageUrl: 'memory-only',
          storageRef: fileRef,
          message: 'Development mode: Receipt processed (Image not stored)'
        };
      }
      
      console.log('Creating storage reference:', fileRef);
      
      // Create a reference to the file location in Firebase Storage
      const storageRef = ref(storage, fileRef);
      
      // Add custom metadata to potentially help with CORS
      const metadata = {
        contentType: imageFile.type,
        customMetadata: {
          'uploaded-by': userId,
          'timestamp': timestamp.toString()
        }
      };
      
      console.log('Starting upload with metadata:', metadata);
      
      // Upload the file with metadata
      const snapshot = await uploadBytes(storageRef, imageFile, metadata);
      console.log('Upload completed successfully:', snapshot);
      
      // Get the download URL
      const imageUrl = await getDownloadURL(snapshot.ref);
      console.log('Generated download URL:', imageUrl);
      
      return { 
        imageUrl,
        message: 'Receipt image uploaded successfully'
      };
    } catch (error) {
      console.error('Error uploading receipt image:', error);
      
      // Enhanced error logging for debugging
      let errorMessage = 'Failed to upload receipt image';
      if (error.code) {
        errorMessage += ` (Code: ${error.code})`;
      }
      
      if (error.serverResponse) {
        console.error('Server response:', error.serverResponse);
        errorMessage += ` - Server error: ${JSON.stringify(error.serverResponse)}`;
      }
      
      // If it's a CORS error, provide helpful information
      if (error.message && error.message.includes('CORS')) {
        console.error('CORS error detected. Please ensure Firebase Storage CORS is configured properly');
        errorMessage = 'CORS error: Your Firebase Storage needs CORS configuration. Please check the Firebase console.';
        
        // In development, offer to fall back to localStorage for testing
        if (isDevelopment) {
          console.log('Offering to use localStorage fallback for future uploads');
          localStorage.setItem('useLocalStorageFallback', 'true');
          
          // Also try to save this image locally as a fallback
          return saveImageToLocalStorage(userId, imageFile);
        }
      }
      
    return { 
        error: errorMessage,
        originalError: error.message,
        code: error.code || 'unknown'
    };
    }
  }
};

export default storageService; 