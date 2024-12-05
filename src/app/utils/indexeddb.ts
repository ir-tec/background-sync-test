import { InputPorps } from "../page";

export async function openDB(dbName: string, storeName: string) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
      }
    };
  });
}

export async function addData(
  dbName: string,
  storeName: string,
  data: InputPorps
) {
  try {
    const db = await openDB(dbName, storeName);
    const transaction = db.transaction(storeName, "readwrite");
    transaction.objectStore(storeName).add(data);
    return true;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function getData(dbName: string, storeName: string) {
  const db = await openDB(dbName, storeName);
  const transaction = db.transaction(storeName, "readonly");
  const store = transaction.objectStore(storeName);
  return new Promise<{ id: string; value: string; timestamp: string | Date }[]>(
    (resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
    }
  );
}
export function saveToLocalStorage(
  key: string,
  data: {
    value: string;
    timestamp: string;
  }
) {
  const existingData = getFromLocalStorage(key);
  existingData.push(data);
  localStorage.setItem(key, JSON.stringify(existingData));
}

export function getFromLocalStorage(key: string) {
  if (!!localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key) as string);
  }
  return [];
}

export function clearLocalStorage(key: string) {
  localStorage.removeItem(key);
}
