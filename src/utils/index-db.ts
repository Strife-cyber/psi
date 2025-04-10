import { Entry } from '..';
import { openDB } from 'idb';

const DB_NAME = 'EntryDB';
const STORE_NAME = 'entries';
const TIMESTAMP_STORE = 'timestamps';

const getDb = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(TIMESTAMP_STORE)) {
        db.createObjectStore(TIMESTAMP_STORE);
      }
    },
  });
};

export const setEntry = async (entry: Entry) => {
  const db = await getDb();
  const tx = db.transaction([STORE_NAME, TIMESTAMP_STORE], 'readwrite');
  await Promise.all([
    tx.objectStore(STORE_NAME).put(entry),
    tx.objectStore(TIMESTAMP_STORE).put(Date.now(), `entry_${entry.id}`)
  ]);
  await tx.done;
};

export const setEntries = async (entries: Entry[]) => {
  const db = await getDb();
  const tx = db.transaction([STORE_NAME, TIMESTAMP_STORE], 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const timeStore = tx.objectStore(TIMESTAMP_STORE);
  console.log("Inserted");
  
  await Promise.all([
    ...entries.map(entry => store.put(entry)),
    timeStore.put(Date.now(), 'entries')
  ]);
  await tx.done;
};

export const getEntry = async (id: number) => {
  const db = await getDb();
  return db.get(STORE_NAME, id);
};

export const getAllEntries = async () => {
  const db = await getDb();
  return db.getAll(STORE_NAME);
};

export const getTimestamp = async (key: string) => {
  const db = await getDb();
  return db.get(TIMESTAMP_STORE, key);
};

export const deleteEntry = async (id: number) => {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.delete(id);
  await tx.done;
};

export const clearAll = async () => {
  const db = await getDb();
  const tx = db.transaction([STORE_NAME, TIMESTAMP_STORE], 'readwrite');
  await Promise.all([
    tx.objectStore(STORE_NAME).clear(),
    tx.objectStore(TIMESTAMP_STORE).clear()
  ]);
  await tx.done;
};
