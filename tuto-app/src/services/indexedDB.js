// Configuration de la base de données
const DB_CONFIG = {
  name: 'better-clicks-db',
  version: 1,
  stores: {
    exercises: {
      keyPath: 'id',
      indexes: [
        { name: 'type', keyPath: 'type' },
        { name: 'timestamp', keyPath: 'timestamp' }
      ]
    },
    validationCache: {
      keyPath: 'key',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' }
      ]
    },
    progress: {
      keyPath: 'id',
      indexes: [
        { name: 'type', keyPath: 'type' },
        { name: 'timestamp', keyPath: 'timestamp' }
      ]
    }
  }
}

class IndexedDBService {
  constructor() {
    this.db = null
    this.isInitialized = false
    this._connectionPromise = null
  }

  // Initialise la connexion à la base de données
  async init() {
    if (this._connectionPromise) {
      return this._connectionPromise
    }

    this._connectionPromise = new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version)

        request.onerror = (event) => {
          console.error('Erreur d\'initialisation de IndexedDB:', event.target.error)
          reject(event.target.error)
        }

        request.onsuccess = (event) => {
          this.db = event.target.result
          this.isInitialized = true
          console.log('IndexedDB initialisé avec succès')
          resolve(this.db)
        }

        request.onupgradeneeded = (event) => {
          const db = event.target.result
          this._createStores(db)
        }
      } catch (error) {
        console.error('Erreur critique lors de l\'initialisation de IndexedDB:', error)
        reject(error)
      }
    })

    return this._connectionPromise
  }

  // Crée les stores (tables) dans la base de données
  _createStores(db) {
    const stores = DB_CONFIG.stores
    
    for (const [storeName, storeConfig] of Object.entries(stores)) {
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: storeConfig.keyPath })
        
        // Création des index pour le store
        if (storeConfig.indexes) {
          storeConfig.indexes.forEach(index => {
            store.createIndex(index.name, index.keyPath, { unique: index.unique || false })
          })
        }
      }
    }
  }

  // Vérifie si la connexion est établie
  async ensureConnection() {
    if (!this.isInitialized) {
      await this.init()
    }
    return this.db
  }

  // Méthode générique pour les transactions en lecture
  async _readTransaction(storeName, callback) {
    const db = await this.ensureConnection()
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(storeName, 'readonly')
        const store = transaction.objectStore(storeName)
        
        const request = callback(store)
        
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      } catch (error) {
        reject(error)
      }
    })
  }

  // Méthode générique pour les transactions en écriture
  async _writeTransaction(storeName, callback) {
    const db = await this.ensureConnection()
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(storeName, 'readwrite')
        const store = transaction.objectStore(storeName)
        
        const request = callback(store)
        
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      } catch (error) {
        reject(error)
      }
    })
  }

  // Ferme la connexion à la base de données
  close() {
    if (this.db) {
      this.db.close()
      this.db = null
      this.isInitialized = false
      this._connectionPromise = null
    }
  }

  // Méthodes pour le store 'exercises'
  async addExercise(exercise) {
    if (!exercise.id) {
      exercise.id = `${exercise.type}-${Date.now()}`
    }
    exercise.timestamp = Date.now()
    
    return this._writeTransaction('exercises', store => 
      store.put(exercise)
    )
  }

  async getExercise(id) {
    return this._readTransaction('exercises', store => 
      store.get(id)
    )
  }

  async getExercisesByType(type) {
    return this._readTransaction('exercises', store => {
      const index = store.index('type')
      return index.getAll(type)
    })
  }

  async deleteExercise(id) {
    return this._writeTransaction('exercises', store => 
      store.delete(id)
    )
  }

  // Méthodes pour le store 'validationCache'
  async addValidationResult(key, result) {
    const entry = {
      key,
      ...result,
      timestamp: Date.now()
    }
    
    return this._writeTransaction('validationCache', store => 
      store.put(entry)
    )
  }

  async getValidationResult(key) {
    return this._readTransaction('validationCache', store => 
      store.get(key)
    )
  }

  async clearOldValidationCache(maxAge = 5 * 60 * 1000) {
    const now = Date.now()
    return this._writeTransaction('validationCache', store => {
      const index = store.index('timestamp')
      const range = IDBKeyRange.upperBound(now - maxAge)
      
      return index.openCursor(range).onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        }
      }
    })
  }

  // Méthodes pour le store 'progress'
  async updateProgress(progress) {
    if (!progress.id) {
      progress.id = `${progress.type}-${Date.now()}`
    }
    progress.timestamp = Date.now()
    
    return this._writeTransaction('progress', store => 
      store.put(progress)
    )
  }

  async getProgress(id) {
    return this._readTransaction('progress', store => 
      store.get(id)
    )
  }

  async getProgressByType(type) {
    return this._readTransaction('progress', store => {
      const index = store.index('type')
      return index.getAll(type)
    })
  }

  // Méthodes utilitaires
  async clearStore(storeName) {
    return this._writeTransaction(storeName, store => 
      store.clear()
    )
  }

  async clearAllData() {
    const stores = Object.keys(DB_CONFIG.stores)
    await Promise.all(stores.map(store => this.clearStore(store)))
  }

  // Méthode pour obtenir les statistiques de la base de données
  async getDatabaseStats() {
    const stats = {}
    const stores = Object.keys(DB_CONFIG.stores)
    
    await Promise.all(stores.map(async (storeName) => {
      const count = await this._readTransaction(storeName, store => 
        store.count()
      )
      stats[storeName] = count
    }))
    
    return stats
  }
}

// Export d'une instance unique du service
export const indexedDBService = new IndexedDBService() 