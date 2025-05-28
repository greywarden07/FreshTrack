/**
 * Service Switcher
 * 
 * This utility automatically switches between Firebase services and mock services
 * based on whether mock data is enabled. It provides a consistent API regardless
 * of which backend is being used.
 * 
 * In development, if Firestore is blocked by an ad blocker, this will seamlessly
 * switch to using mock data without requiring code changes throughout the app.
 */

import mockDataService from '../services/mockDataService';
import * as firebaseUsers from './users';
import * as firebaseGroceries from './groceries';
import storageService from '../services/storage';

// Check if we should use mock data
const shouldUseMockData = () => {
  const isDev = process.env.NODE_ENV === 'development';
  const isMockEnabled = mockDataService.isMockEnabled();
  console.log('[ServiceSwitcher] shouldUseMockData check:', { 
    isDev, 
    isMockEnabled, 
    result: isDev && isMockEnabled
  });
  return isDev && isMockEnabled;
};

// User services
export const createUser = async (userId, email, name) => {
  if (shouldUseMockData()) {
    console.log('[Mock] Creating user:', { userId, email, name });
    return mockDataService.createUser(userId, email, name);
  }
  return firebaseUsers.createUser(userId, email, name);
};

export const getUser = async (userId) => {
  if (shouldUseMockData()) {
    console.log('[Mock] Getting user:', userId);
    return mockDataService.getUser(userId);
  }
  return firebaseUsers.getUser(userId);
};

// Grocery/Pantry services
export const getPantryItems = async (userId) => {
  if (shouldUseMockData()) {
    console.log('[Mock] Getting pantry items for user:', userId);
    return mockDataService.getPantryItems(userId);
  }
  return firebaseGroceries.getPantryItems(userId);
};

export const addItemsToPantry = async (userId, items) => {
  if (shouldUseMockData()) {
    console.log('[Mock] Adding items to pantry for user:', userId, items);
    return mockDataService.addItemsToPantry(userId, items);
  }
  return firebaseGroceries.addItemsToPantry(userId, items);
};

export const updatePantryItem = async (userId, item) => {
  if (shouldUseMockData()) {
    console.log('[Mock] Updating pantry item for user:', userId, item);
    return mockDataService.updatePantryItem(userId, item);
  }
  return firebaseGroceries.updatePantryItem(userId, item);
};

export const removeItemFromPantry = async (userId, item) => {
  if (shouldUseMockData()) {
    console.log('[Mock] Removing item from pantry for user:', userId, item);
    return mockDataService.removeItemFromPantry(userId, item);
  }
  return firebaseGroceries.removeItemFromPantry(userId, item);
};

// Storage service with automatic switching
export const dataService = {
  saveItems: async (userId, purchaseDate, items) => {
    if (shouldUseMockData()) {
      console.log('[Mock] Saving items with purchase date:', purchaseDate, items);
      return mockDataService.addItemsToPantry(userId, items.map(item => ({ ...item, purchaseDate })));
    }
    return storageService.saveItems(userId, purchaseDate, items);
  },
  
  getItems: async (userId) => {
    if (shouldUseMockData()) {
      console.log('[Mock] Getting all items for user:', userId);
      return mockDataService.getPantryItems(userId);
    }
    return storageService.getItems(userId);
  },
  
  addItem: async (userId, purchaseDate, item) => {
    if (shouldUseMockData()) {
      console.log('[Mock] Adding single item with purchase date:', purchaseDate, item);
      return mockDataService.addItemsToPantry(userId, [{ ...item, purchaseDate }]);
    }
    return storageService.addItem(userId, purchaseDate, item);
  },
  
  editItem: async (userId, item) => {
    if (shouldUseMockData()) {
      console.log('[Mock] Editing item:', item);
      return mockDataService.updatePantryItem(userId, item);
    }
    return storageService.editItem(userId, item);
  },
  
  deleteItem: async (userId, item) => {
    if (shouldUseMockData()) {
      console.log('[Mock] Deleting item:', item);
      return mockDataService.removeItemFromPantry(userId, item);
    }
    return storageService.deleteItem(userId, item);
  },
  
  deleteAllItems: async (userId) => {
    console.log('[ServiceSwitcher] deleteAllItems called for user:', userId);
    const useMock = shouldUseMockData();
    console.log('[ServiceSwitcher] Using mock data for deletion:', useMock);
    
    if (useMock) {
      console.log('[Mock] Deleting all items for user:', userId);
      try {
        const result = await mockDataService.deleteAllItems(userId);
        console.log('[Mock] Delete result:', result);
        return result;
      } catch (error) {
        console.error('[Mock] Error deleting items:', error);
        throw error;
      }
    }
    
    console.log('[Firebase] Deleting all items for user:', userId);
    try {
      const result = await storageService.deleteAllItems(userId);
      console.log('[Firebase] Delete result:', result);
      return result;
    } catch (error) {
      console.error('[Firebase] Error deleting items:', error);
      throw error;
    }
  },
  
  modifyPurchaseDate: async (userId, items, purchaseDate) => {
    if (shouldUseMockData()) {
      console.log('[Mock] Modifying purchase date for items:', purchaseDate, items);
      const updatePromises = items.map(item => {
        const updatedItem = { ...item, purchaseDate };
        return mockDataService.updatePantryItem(userId, updatedItem);
      });
      return Promise.all(updatePromises);
    }
    return storageService.modifyPurchaseDate(userId, items, purchaseDate);
  },
  
  saveReceiptImage: async (userId, imageFile) => {
    if (shouldUseMockData()) {
      console.log('[Mock] Saving receipt image:', imageFile.name);
      return mockDataService.saveReceiptImage(userId, imageFile);
    }
    return storageService.saveReceiptImage(userId, imageFile);
  }
};

export default {
  createUser,
  getUser,
  getPantryItems,
  addItemsToPantry,
  updatePantryItem,
  removeItemFromPantry,
  dataService
}; 