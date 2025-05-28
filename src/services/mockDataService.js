/**
 * Mock Data Service
 * 
 * Provides local mock data when Firestore is blocked by ad blockers or privacy extensions.
 * This allows development to continue even when Firebase connections are being blocked.
 * 
 * NOTE: This is for development purposes only and should not be used in production.
 */

// Default mock data
const DEFAULT_USER = {
  userId: 'mock-user-123',
  name: 'Mock User',
  email: 'mock@example.com',
  itemCardinality: 10,
  nextItemId: 11,
  createdAt: new Date('2023-01-01')
};

// Generate mock items
const generateMockItems = () => {
  const today = new Date();
  const items = [
    {
      id: 1,
      name: 'Milk',
      category: 'dairy',
      quantity: '1 gallon',
      price: '$3.99',
      isPerishable: true,
      expiryDays: 7,
      expiryDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      name: 'Eggs',
      category: 'refrigerated',
      quantity: '12 count',
      price: '$2.49',
      isPerishable: true,
      expiryDays: 21,
      expiryDate: new Date(today.getTime() + 19 * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      name: 'Bread',
      category: 'bakery',
      quantity: '1 loaf',
      price: '$2.99',
      isPerishable: true,
      expiryDays: 5,
      expiryDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 4,
      name: 'Bananas',
      category: 'produce',
      quantity: '1 bunch',
      price: '$1.99',
      isPerishable: true,
      expiryDays: 4,
      expiryDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 5,
      name: 'Ground Beef',
      category: 'meat',
      quantity: '1 lb',
      price: '$5.99',
      isPerishable: true,
      expiryDays: 3,
      expiryDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 6,
      name: 'Yogurt',
      category: 'dairy',
      quantity: '32 oz',
      price: '$4.49',
      isPerishable: true,
      expiryDays: 14,
      expiryDate: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 7,
      name: 'Chicken Breast',
      category: 'meat',
      quantity: '2 lbs',
      price: '$8.99',
      isPerishable: true,
      expiryDays: 3,
      expiryDate: new Date(today.getTime() + 0 * 24 * 60 * 60 * 1000), // Today!
      purchaseDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 8,
      name: 'Apples',
      category: 'produce',
      quantity: '5 count',
      price: '$4.99',
      isPerishable: true,
      expiryDays: 14,
      expiryDate: new Date(today.getTime() + 11 * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 9,
      name: 'Cheese',
      category: 'dairy',
      quantity: '8 oz',
      price: '$3.49',
      isPerishable: true,
      expiryDays: 21,
      expiryDate: new Date(today.getTime() + 18 * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 10,
      name: 'Cereal',
      category: 'pantry',
      quantity: '18 oz box',
      price: '$3.99',
      isPerishable: true,
      expiryDays: 180,
      expiryDate: new Date(today.getTime() + 177 * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)
    }
  ];
  
  // Calculate daysLeft for each item
  return items.map(item => {
    const timeDiff = item.expiryDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return { ...item, daysLeft };
  });
};

// Initialize mock data storage
let mockData = {
  user: DEFAULT_USER,
  items: generateMockItems(),
  nextItemId: 11
};

// Helper to persist mock data to localStorage
const saveMockData = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('mockFirestoreData', JSON.stringify(mockData));
  }
};

// Helper to load mock data from localStorage
const loadMockData = () => {
  if (typeof localStorage !== 'undefined') {
    const savedData = localStorage.getItem('mockFirestoreData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        
        // Convert string dates back to Date objects
        if (parsed.items) {
          parsed.items = parsed.items.map(item => ({
            ...item,
            expiryDate: new Date(item.expiryDate),
            purchaseDate: new Date(item.purchaseDate)
          }));
        }
        
        if (parsed.user && parsed.user.createdAt) {
          parsed.user.createdAt = new Date(parsed.user.createdAt);
        }
        
        mockData = parsed;
      } catch (e) {
        console.error('Error loading mock data from localStorage:', e);
      }
    }
  }
};

// Load data on initialization
loadMockData();

// Service methods mirroring Firestore operations
const mockDataService = {
  // Check if using mock data
  isMockEnabled: () => {
    return localStorage.getItem('useMockData') === 'true';
  },
  
  // Enable or disable mock data
  setMockEnabled: (enabled) => {
    localStorage.setItem('useMockData', enabled ? 'true' : 'false');
  },
  
  // Reset mock data to defaults
  resetMockData: () => {
    mockData = {
      user: DEFAULT_USER,
      items: generateMockItems(),
      nextItemId: 11
    };
    saveMockData();
    return mockData;
  },
  
  // User operations
  getUser: async (userId) => {
    // Simulate network delay for realistic behavior
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...mockData.user };
  },
  
  createUser: async (userId, email, name) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockData.user = {
      userId,
      email,
      name,
      itemCardinality: 0,
      nextItemId: 0,
      createdAt: new Date()
    };
    saveMockData();
    return { ...mockData.user };
  },
  
  // Item operations
  getPantryItems: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockData.items];
  },
  
  addItemsToPantry: async (userId, items) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newItems = items.map(item => ({
      ...item,
      id: mockData.nextItemId++
    }));
    
    mockData.items = [...mockData.items, ...newItems];
    mockData.user.itemCardinality = mockData.items.length;
    saveMockData();
    
    return mockData.items;
  },
  
  updatePantryItem: async (userId, item) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockData.items.findIndex(i => i.id === item.id);
    if (index >= 0) {
      mockData.items[index] = { ...item };
      saveMockData();
    }
    
    return mockData.items;
  },
  
  removeItemFromPantry: async (userId, item) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    mockData.items = mockData.items.filter(i => i.id !== item.id);
    mockData.user.itemCardinality = mockData.items.length;
    saveMockData();
    
    return mockData.items;
  },
  
  // Image storage operations
  saveReceiptImage: async (userId, imageFile) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a data URL from the image
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          imageUrl: reader.result,
          message: 'Mock receipt image saved successfully'
        });
      };
      reader.readAsDataURL(imageFile);
    });
  },
  
  // Delete all pantry items for a user
  deleteAllItems: async (userId) => {
    console.log('[Mock] Starting to delete all items for user:', userId);
    
    if (!userId) {
      console.error('[Mock] No user ID provided to deleteAllItems');
      return { success: false, message: 'No user ID provided' };
    }
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Store the count for the result message
      const deletedCount = mockData.items.length;
      console.log(`[Mock] Deleting ${deletedCount} items`);
      
      // Clear the items array
      mockData.items = [];
      mockData.user.itemCardinality = 0;
      
      // Save the changes to localStorage
      saveMockData();
      
      console.log('[Mock] Deleted all items for user:', userId);
      return { 
        success: true, 
        message: `All items deleted successfully (${deletedCount} items)` 
      };
    } catch (error) {
      console.error('[Mock] Error in deleteAllItems:', error);
      return { 
        success: false, 
        message: `Failed to delete items: ${error.message || 'Unknown error'}`,
        error
      };
    }
  }
};

export default mockDataService; 