const DATABASE = 'cstar';
const STORE = 'saves';

const openDatabase = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Cannot open the database'));
  });

/** One transaction: it either happens whole or not at all, so a save is never half written. */
const transact = async <T>(
  mode: IDBTransactionMode,
  work: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> => {
  const database = await openDatabase();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = database.transaction(STORE, mode);
      const request = work(transaction.objectStore(STORE));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onerror = () => reject(transaction.error ?? new Error('Transaction failed'));
      transaction.onabort = () => reject(transaction.error ?? new Error('Transaction aborted'));
    });
  } finally {
    database.close();
  }
};

export type SaveSlot = 'auto' | 'broken';

export const saveBackend = {
  read: (slot: SaveSlot): Promise<unknown> =>
    transact('readonly', (store) => store.get(slot) as IDBRequest<unknown>),
  write: async (slot: SaveSlot, value: unknown): Promise<void> => {
    await transact('readwrite', (store) => store.put(value, slot));
  },
  remove: async (slot: SaveSlot): Promise<void> => {
    await transact('readwrite', (store) => store.delete(slot));
  },
};
