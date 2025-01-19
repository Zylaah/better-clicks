import { ref, onUnmounted } from 'vue'
import { indexedDBService } from '@/services/indexedDB'

export function useIndexedDBCache(options = {}) {
  const {
    maxMemoryEntries = 50,
    syncInterval = 5000, // Intervalle de synchronisation avec IndexedDB en ms
    maxAge = 5 * 60 * 1000 // Durée de vie maximale des entrées (5 minutes par défaut)
  } = options

  const memoryCache = ref(new Map())
  const accessTimes = ref(new Map())
  let syncIntervalId = null

  // Synchronise une entrée spécifique avec IndexedDB
  const syncToIndexedDB = async (key, value) => {
    try {
      if (key.startsWith('validation-')) {
        await indexedDBService.addValidationResult(key, value)
      } else if (key.startsWith('exercise-')) {
        await indexedDBService.addExercise({
          id: key,
          ...value
        })
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation avec IndexedDB:', error)
    }
  }

  // Récupère une entrée depuis IndexedDB si elle n'est pas en mémoire
  const getFromIndexedDB = async (key) => {
    try {
      if (key.startsWith('validation-')) {
        return await indexedDBService.getValidationResult(key)
      } else if (key.startsWith('exercise-')) {
        return await indexedDBService.getExercise(key)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération depuis IndexedDB:', error)
      return null
    }
  }

  // Gestion du cache mémoire
  const enforceMaxEntries = () => {
    if (memoryCache.value.size > maxMemoryEntries) {
      const entries = Array.from(accessTimes.value.entries())
      entries.sort((a, b) => a[1] - b[1])
      
      const entriesToRemove = entries.slice(0, entries.length - maxMemoryEntries)
      entriesToRemove.forEach(([key]) => {
        memoryCache.value.delete(key)
        accessTimes.value.delete(key)
      })
    }
  }

  // Ajoute une entrée au cache
  const addToCache = async (key, value) => {
    memoryCache.value.set(key, value)
    accessTimes.value.set(key, Date.now())
    enforceMaxEntries()
    await syncToIndexedDB(key, value)
  }

  // Récupère une entrée du cache
  const getFromCache = async (key) => {
    let value = memoryCache.value.get(key)
    
    if (!value) {
      // Si non trouvé en mémoire, essayer dans IndexedDB
      value = await getFromIndexedDB(key)
      if (value) {
        // Mettre en cache mémoire si trouvé dans IndexedDB
        memoryCache.value.set(key, value)
        accessTimes.value.set(key, Date.now())
        enforceMaxEntries()
      }
    } else {
      accessTimes.value.set(key, Date.now())
    }
    
    return value
  }

  // Nettoie les entrées expirées
  const cleanOldEntries = async () => {
    const now = Date.now()
    
    // Nettoyage du cache mémoire
    for (const [key, time] of accessTimes.value.entries()) {
      if (now - time > maxAge) {
        memoryCache.value.delete(key)
        accessTimes.value.delete(key)
      }
    }
    
    // Nettoyage de IndexedDB
    try {
      await indexedDBService.clearOldValidationCache(maxAge)
    } catch (error) {
      console.error('Erreur lors du nettoyage de IndexedDB:', error)
    }
  }

  // Démarre la synchronisation périodique
  const startSync = () => {
    if (!syncIntervalId) {
      syncIntervalId = setInterval(cleanOldEntries, syncInterval)
    }
  }

  // Arrête la synchronisation périodique
  const stopSync = () => {
    if (syncIntervalId) {
      clearInterval(syncIntervalId)
      syncIntervalId = null
    }
  }

  // Nettoyage complet du cache
  const clearCache = async () => {
    memoryCache.value.clear()
    accessTimes.value.clear()
    stopSync()
    try {
      await indexedDBService.clearAllData()
    } catch (error) {
      console.error('Erreur lors du nettoyage de IndexedDB:', error)
    }
  }

  // Initialisation
  startSync()

  // Nettoyage lors du démontage
  onUnmounted(() => {
    stopSync()
  })

  return {
    addToCache,
    getFromCache,
    cleanOldEntries,
    clearCache,
    stopSync
  }
} 