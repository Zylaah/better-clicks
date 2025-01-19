import { ref } from 'vue'

const DB_NAME = 'KeyboardExercisesDB'
const DB_VERSION = 1
const STORES = {
  exerciseCache: 'exerciseCache',
  userProgress: 'userProgress',
  exerciseStats: 'exerciseStats'
}

export function useIndexedDB() {
  const isReady = ref(false)
  const hasError = ref(false)
  let db = null

  const initDB = () => {
    return new Promise((resolve, reject) => {
      if (db) {
        resolve(db)
        return
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = (event) => {
        console.warn('IndexedDB error:', event.target.error)
        hasError.value = true
        reject(event.target.error)
      }

      request.onsuccess = (event) => {
        db = event.target.result
        isReady.value = true
        resolve(db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // Store pour le cache des exercices
        if (!db.objectStoreNames.contains(STORES.exerciseCache)) {
          db.createObjectStore(STORES.exerciseCache, {
            keyPath: 'id'
          })
        }

        // Store pour la progression utilisateur
        if (!db.objectStoreNames.contains(STORES.userProgress)) {
          db.createObjectStore(STORES.userProgress, {
            keyPath: 'type'
          })
        }

        // Store pour les statistiques
        if (!db.objectStoreNames.contains(STORES.exerciseStats)) {
          const statsStore = db.createObjectStore(STORES.exerciseStats, {
            keyPath: 'id',
            autoIncrement: true
          })
          statsStore.createIndex('type', 'type')
          statsStore.createIndex('timestamp', 'timestamp')
        }
      }
    })
  }

  const getFromStore = async (storeName, key) => {
    try {
      const db = await initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.get(key)

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.warn('Error getting from store:', error)
      return null
    }
  }

  const setInStore = async (storeName, data) => {
    try {
      const db = await initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.put(data)

        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.warn('Error setting in store:', error)
      return false
    }
  }

  const getAllFromStore = async (storeName) => {
    try {
      const db = await initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.getAll()

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.warn('Error getting all from store:', error)
      return []
    }
  }

  const deleteFromStore = async (storeName, key) => {
    try {
      const db = await initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.delete(key)

        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.warn('Error deleting from store:', error)
      return false
    }
  }

  const clearStore = async (storeName) => {
    try {
      const db = await initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.clear()

        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.warn('Error clearing store:', error)
      return false
    }
  }

  return {
    isReady,
    hasError,
    getFromStore,
    setInStore,
    getAllFromStore,
    deleteFromStore,
    clearStore,
    STORES
  }
} 