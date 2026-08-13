// IndexedDB utilities for offline support

const DB_NAME = 'BarManagementDB';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      if (!database.objectStoreNames.contains('products')) {
        const productStore = database.createObjectStore('products', { keyPath: 'id' });
        productStore.createIndex('category', 'category', { unique: false });
      }

      if (!database.objectStoreNames.contains('sales')) {
        const saleStore = database.createObjectStore('sales', { keyPath: 'id' });
        saleStore.createIndex('timestamp', 'createdAt', { unique: false });
        saleStore.createIndex('synced', 'synced', { unique: false });
      }

      if (!database.objectStoreNames.contains('pendingSales')) {
        database.createObjectStore('pendingSales', { keyPath: 'id' });
      }
    };
  });
}

export async function saveProducts(products: any[]): Promise<void> {
  const database = await initDB();
  const transaction = database.transaction(['products'], 'readwrite');
  const store = transaction.objectStore('products');

  for (const product of products) {
    await new Promise((resolve, reject) => {
      const request = store.put(product);
      request.onsuccess = () => resolve(null);
      request.onerror = () => reject(request.error);
    });
  }
}

export async function getProducts(): Promise<any[]> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['products'], 'readonly');
    const store = transaction.objectStore('products');
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function addPendingSale(sale: any): Promise<void> {
  const database = await initDB();
  const transaction = database.transaction(['pendingSales'], 'readwrite');
  const store = transaction.objectStore('pendingSales');

  return new Promise((resolve, reject) => {
    const request = store.add(sale);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getPendingSales(): Promise<any[]> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['pendingSales'], 'readonly');
    const store = transaction.objectStore('pendingSales');
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function removePendingSale(id: string): Promise<void> {
  const database = await initDB();
  const transaction = database.transaction(['pendingSales'], 'readwrite');
  const store = transaction.objectStore('pendingSales');

  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function updateProductQuantity(
  productId: string,
  quantity: number
): Promise<void> {
  const database = await initDB();
  const transaction = database.transaction(['products'], 'readwrite');
  const store = transaction.objectStore('products');

  return new Promise((resolve, reject) => {
    const getRequest = store.get(productId);

    getRequest.onsuccess = () => {
      const product = getRequest.result;
      if (product) {
        product.quantity = quantity;
        const updateRequest = store.put(product);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        resolve();
      }
    };

    getRequest.onerror = () => {
      reject(getRequest.error);
    };
  });
}

export async function clearAllData(): Promise<void> {
  const database = await initDB();
  const stores = ['products', 'sales', 'pendingSales'];

  for (const storeName of stores) {
    if (database.objectStoreNames.contains(storeName)) {
      const transaction = database.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      await new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve(null);
        request.onerror = () => reject(request.error);
      });
    }
  }
}
