// IndexedDB helper for resilient client-side draft & image caching
const DB_NAME = 'KMPersonalizadosDB';
const DB_VERSION = 1;
const STORE_NAME = 'draftPhotos';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveDraftPhotos(photos) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.clear();
    for (const p of photos) {
      await store.put(p);
    }
    return true;
  } catch (err) {
    console.warn('IndexedDB save draft error:', err);
    return false;
  }
}

export async function getDraftPhotos() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    console.warn('IndexedDB get draft error:', err);
    return [];
  }
}

export async function clearDraftPhotos() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
  } catch (err) {
    console.warn('IndexedDB clear error:', err);
  }
}

// LocalStorage helpers for order tracking history & session
export function getSavedOrderCodes() {
  try {
    const codes = localStorage.getItem('km_order_codes');
    return codes ? JSON.parse(codes) : [];
  } catch {
    return [];
  }
}

export function saveOrderCode(code) {
  try {
    const codes = getSavedOrderCodes();
    if (!codes.includes(code)) {
      codes.unshift(code);
      localStorage.setItem('km_order_codes', JSON.stringify(codes.slice(0, 10)));
    }
  } catch {}
}
