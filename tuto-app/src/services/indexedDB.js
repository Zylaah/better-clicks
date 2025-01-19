const DB_NAME = 'better-clicks-db'
const DB_VERSION = 2

const STORES = {
  userProgress: {
    name: 'userProgress',
    keyPath: 'exerciseType',
    indexes: [
      { name: 'lastAccess', keyPath: 'lastAccess' },
      { name: 'completionRate', keyPath: 'completionRate' }
    ]
  },
  exerciseStats: {
    name: 'exerciseStats',
    keyPath: 'id',
    indexes: [
      { name: 'exerciseType', keyPath: 'exerciseType' },
      { name: 'date', keyPath: 'date' }
    ]
  },
  exerciseState: {
    name: 'exerciseState',
    keyPath: 'id',
    indexes: [
      { name: 'exerciseType', keyPath: 'exerciseType' },
      { name: 'timestamp', keyPath: 'timestamp' }
    ]
  },
  settings: {
    name: 'settings',
    keyPath: 'id'
  },
  exercises: {
    name: 'exercises',
    keyPath: 'id',
    indexes: [
      { name: 'type', keyPath: 'type' },
      { name: 'timestamp', keyPath: 'timestamp' }
    ]
  },
  validationResults: {
    name: 'validationResults',
    keyPath: 'id',
    indexes: [
      { name: 'timestamp', keyPath: 'timestamp' }
    ]
  }
}

class IndexedDBService {
  constructor() {
    this.db = null
    this.isInitialized = false
  }

  async init() {
    if (this.isInitialized) return

    try {
      this.db = await new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onerror = () => {
          console.error('Erreur lors de l\'ouverture de la base de données')
          reject(request.error)
        }

        request.onsuccess = () => {
          resolve(request.result)
        }

        request.onupgradeneeded = (event) => {
          const db = event.target.result

          // Création des stores
          Object.values(STORES).forEach(store => {
            if (!db.objectStoreNames.contains(store.name)) {
              const objectStore = db.createObjectStore(store.name, { keyPath: store.keyPath })
              
              // Création des index
              if (store.indexes) {
                store.indexes.forEach(index => {
                  objectStore.createIndex(index.name, index.keyPath)
                })
              }
            }
          })
        }
      })

      this.isInitialized = true
    } catch (error) {
      console.error('Erreur d\'initialisation IndexedDB:', error)
      throw error
    }
  }

  async getStore(storeName, mode = 'readonly') {
    if (!this.isInitialized) {
      await this.init()
    }

    const transaction = this.db.transaction(storeName, mode)
    return transaction.objectStore(storeName)
  }

  // Méthodes pour la gestion des exercices
  async addExercise(exercise) {
    try {
      const store = await this.getStore('exercises', 'readwrite')
      await new Promise((resolve, reject) => {
        const request = store.put(exercise)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'exercice:', error)
      throw error
    }
  }

  async getExercise(id) {
    try {
      const store = await this.getStore('exercises')
      return new Promise((resolve, reject) => {
        const request = store.get(id)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'exercice:', error)
      throw error
    }
  }

  // Méthodes pour la gestion des résultats de validation
  async addValidationResult(key, result) {
    try {
      const store = await this.getStore('validationResults', 'readwrite')
      await new Promise((resolve, reject) => {
        const request = store.put({ id: key, ...result })
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Erreur lors de l\'ajout du résultat de validation:', error)
      throw error
    }
  }

  async getValidationResult(key) {
    try {
      const store = await this.getStore('validationResults')
      return new Promise((resolve, reject) => {
        const request = store.get(key)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Erreur lors de la récupération du résultat de validation:', error)
      throw error
    }
  }

  // Méthodes pour userProgress
  async saveProgress(exerciseType, progress) {
    try {
      const store = await this.getStore(STORES.userProgress.name, 'readwrite')
      const data = {
        exerciseType,
        ...progress,
        lastAccess: Date.now()
      }
      await new Promise((resolve, reject) => {
        const request = store.put(data)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la progression:', error)
      throw error
    }
  }

  async getProgress(exerciseType) {
    try {
      const store = await this.getStore(STORES.userProgress.name)
      return new Promise((resolve, reject) => {
        const request = store.get(exerciseType)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Erreur lors de la récupération de la progression:', error)
      throw error
    }
  }

  // Méthodes pour exerciseStats
  async saveStats(stats) {
    try {
      const store = await this.getStore(STORES.exerciseStats.name, 'readwrite')
      const data = {
        id: `${stats.exerciseType}-${Date.now()}`,
        ...stats,
        date: new Date().toISOString()
      }
      await new Promise((resolve, reject) => {
        const request = store.add(data)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des statistiques:', error)
      throw error
    }
  }

  async getStatsByType(exerciseType) {
    try {
      const store = await this.getStore(STORES.exerciseStats.name)
      const index = store.index('exerciseType')
      return new Promise((resolve, reject) => {
        const request = index.getAll(exerciseType)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  }

  // Méthodes pour exerciseState
  async saveState(state) {
    try {
      const store = await this.getStore(STORES.exerciseState.name, 'readwrite')
      const data = {
        id: `${state.exerciseType}-current`,
        ...state,
        timestamp: Date.now()
      }
      await new Promise((resolve, reject) => {
        const request = store.put(data)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'état:', error)
      throw error
    }
  }

  async getState(exerciseType) {
    try {
      const store = await this.getStore(STORES.exerciseState.name)
      return new Promise((resolve, reject) => {
        const request = store.get(`${exerciseType}-current`)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'état:', error)
      throw error
    }
  }

  // Méthodes pour settings
  async saveSettings(settings) {
    try {
      const store = await this.getStore(STORES.settings.name, 'readwrite')
      await new Promise((resolve, reject) => {
        const request = store.put(settings)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error)
      throw error
    }
  }

  async getSettings(id = 'global') {
    try {
      const store = await this.getStore(STORES.settings.name)
      return new Promise((resolve, reject) => {
        const request = store.get(id)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres:', error)
      throw error
    }
  }

  // Méthodes de nettoyage
  async clearAllData() {
    try {
      const stores = Object.values(STORES).map(store => store.name)
      await Promise.all(stores.map(async (storeName) => {
        try {
          const store = await this.getStore(storeName, 'readwrite')
          await new Promise((resolve, reject) => {
            const request = store.clear()
            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
          })
        } catch (error) {
          console.warn(`Erreur lors du nettoyage du store ${storeName}:`, error)
        }
      }))
    } catch (error) {
      console.error('Erreur lors du nettoyage complet:', error)
      throw error
    }
  }

  async clearOldValidationCache(maxAge) {
    try {
      const store = await this.getStore('validationResults', 'readwrite')
      const now = Date.now()
      const range = IDBKeyRange.upperBound(now - maxAge)
      
      const request = store.index('timestamp').openCursor(range)
      
      return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
          const cursor = event.target.result
          if (cursor) {
            cursor.delete()
            cursor.continue()
          } else {
            resolve()
          }
        }
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('Erreur lors du nettoyage du cache de validation:', error)
      throw error
    }
  }

  async clearOldData(maxAge = 30 * 24 * 60 * 60 * 1000) { // 30 jours par défaut
    try {
      const minTimestamp = Date.now() - maxAge
      
      // Nettoyer les anciennes statistiques
      const statsStore = await this.getStore(STORES.exerciseStats.name, 'readwrite')
      const dateIndex = statsStore.index('date')
      const oldStats = await new Promise((resolve, reject) => {
        const request = dateIndex.getAllKeys(IDBKeyRange.upperBound(new Date(minTimestamp).toISOString()))
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      await Promise.all(oldStats.map(key => 
        new Promise((resolve, reject) => {
          const request = statsStore.delete(key)
          request.onsuccess = () => resolve()
          request.onerror = () => reject(request.error)
        })
      ))

    } catch (error) {
      console.error('Erreur lors du nettoyage des anciennes données:', error)
      throw error
    }
  }
}

export const indexedDBService = new IndexedDBService() 