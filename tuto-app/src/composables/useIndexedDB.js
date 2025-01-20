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
      console.log('Initializing IndexedDB...')
      if (db) {
        console.log('Database already initialized')
        resolve(db)
        return
      }

      try {
        console.log('Opening database:', DB_NAME, 'version:', DB_VERSION)
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onerror = (event) => {
          console.error('IndexedDB error:', event.target.error)
          hasError.value = true
          reject(event.target.error)
        }

        request.onblocked = (event) => {
          console.warn('IndexedDB blocked:', event)
        }

        request.onsuccess = (event) => {
          console.log('IndexedDB opened successfully')
          db = event.target.result
          isReady.value = true

          // Écouter les erreurs de la base de données
          db.onerror = (event) => {
            console.error('Database error:', event.target.error)
          }

          resolve(db)
        }

        request.onupgradeneeded = (event) => {
          console.log('Upgrading database...')
          const db = event.target.result

          // Store pour le cache des exercices
          if (!db.objectStoreNames.contains(STORES.exerciseCache)) {
            console.log('Creating exerciseCache store')
            const exerciseStore = db.createObjectStore(STORES.exerciseCache, {
              keyPath: 'id'
            })
            exerciseStore.createIndex('timestamp', 'timestamp', { unique: false })
          }

          // Store pour la progression utilisateur
          if (!db.objectStoreNames.contains(STORES.userProgress)) {
            console.log('Creating userProgress store')
            const progressStore = db.createObjectStore(STORES.userProgress, {
              keyPath: 'type'
            })
            progressStore.createIndex('timestamp', 'timestamp', { unique: false })
          }

          // Store pour les statistiques
          if (!db.objectStoreNames.contains(STORES.exerciseStats)) {
            console.log('Creating exerciseStats store')
            const statsStore = db.createObjectStore(STORES.exerciseStats, {
              keyPath: 'id',
              autoIncrement: true
            })
            statsStore.createIndex('type', 'type')
            statsStore.createIndex('timestamp', 'timestamp')
          }
        }
      } catch (error) {
        console.error('Error during IndexedDB initialization:', error)
        hasError.value = true
        reject(error)
      }
    })
  }

  const getFromStore = async (storeName, key) => {
    try {
      console.log(`Getting from store: ${storeName}, key: ${key}`)
      const db = await initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.get(key)

        request.onsuccess = () => {
          console.log(`Got data from store: ${storeName}`, request.result)
          resolve(request.result)
        }
        request.onerror = () => {
          console.error(`Error getting data from store: ${storeName}`, request.error)
          reject(request.error)
        }
      })
    } catch (error) {
      console.warn('Error getting from store:', error)
      return null
    }
  }

  const setInStore = async (storeName, data) => {
    try {
      console.log(`Setting in store: ${storeName}`, data)
      const db = await initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.put(data)

        request.onsuccess = () => {
          console.log(`Data set in store: ${storeName}`)
          resolve(true)
        }
        request.onerror = () => {
          console.error(`Error setting data in store: ${storeName}`, request.error)
          reject(request.error)
        }
      })
    } catch (error) {
      console.warn('Error setting in store:', error)
      return false
    }
  }

  const getAllFromStore = async (storeName) => {
    try {
      console.log(`Getting all from store: ${storeName}`)
      const db = await initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.getAll()

        request.onsuccess = () => {
          console.log(`Got all data from store: ${storeName}`, request.result)
          resolve(request.result)
        }
        request.onerror = () => {
          console.error(`Error getting all data from store: ${storeName}`, request.error)
          reject(request.error)
        }
      })
    } catch (error) {
      console.warn('Error getting all from store:', error)
      return []
    }
  }

  const deleteFromStore = async (storeName, key) => {
    try {
      console.log(`Deleting from store: ${storeName}, key: ${key}`)
      const db = await initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.delete(key)

        request.onsuccess = () => {
          console.log(`Deleted from store: ${storeName}`)
          resolve(true)
        }
        request.onerror = () => {
          console.error(`Error deleting from store: ${storeName}`, request.error)
          reject(request.error)
        }
      })
    } catch (error) {
      console.warn('Error deleting from store:', error)
      return false
    }
  }

  const clearStore = async (storeName) => {
    try {
      console.log(`Clearing store: ${storeName}`)
      const db = await initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.clear()

        request.onsuccess = () => {
          console.log(`Cleared store: ${storeName}`)
          resolve(true)
        }
        request.onerror = () => {
          console.error(`Error clearing store: ${storeName}`, request.error)
          reject(request.error)
        }
      })
    } catch (error) {
      console.warn('Error clearing store:', error)
      return false
    }
  }

  // Initialiser la base de données immédiatement
  initDB().catch(error => {
    console.error('Failed to initialize IndexedDB:', error)
    hasError.value = true
  })

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