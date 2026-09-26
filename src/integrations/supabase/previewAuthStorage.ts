/**
 * Supabase's auth client persists its session to storage on every token
 * refresh. In sandboxed preview contexts (e.g. an iframe with storage
 * partitioning disabled) `window.localStorage` can throw on access instead
 * of just being unavailable, which would otherwise crash the client at
 * import time. This adapter probes localStorage once and transparently
 * falls back to an in-memory store when it isn't usable.
 */

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

const createMemoryStorage = (): StorageLike => {
  const store = new Map<string, string>()
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value)
    },
    removeItem: (key) => {
      store.delete(key)
    },
  }
}

const isLocalStorageAvailable = () => {
  try {
    const testKey = '__supabase_storage_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

export const previewAuthStorage: StorageLike = isLocalStorageAvailable()
  ? window.localStorage
  : createMemoryStorage()
