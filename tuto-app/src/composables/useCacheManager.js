import { ref, onBeforeUnmount } from 'vue'

export function useCacheManager(maxEntries = 100) {
  const cache = ref(new Map())
  const accessTimes = ref(new Map())
  
  // Limiter la taille du cache
  const enforceMaxEntries = () => {
    if (cache.value.size > maxEntries) {
      // Supprimer les entrées les plus anciennes
      const entries = Array.from(accessTimes.value.entries())
      entries.sort((a, b) => a[1] - b[1])
      
      const entriesToRemove = entries.slice(0, entries.length - maxEntries)
      entriesToRemove.forEach(([key]) => {
        cache.value.delete(key)
        accessTimes.value.delete(key)
      })
    }
  }

  const addToCache = (key, value) => {
    cache.value.set(key, value)
    accessTimes.value.set(key, Date.now())
    enforceMaxEntries()
  }

  const getFromCache = (key) => {
    const value = cache.value.get(key)
    if (value) {
      accessTimes.value.set(key, Date.now())
    }
    return value
  }

  const cleanOldEntries = (maxAge = 5 * 60 * 1000) => { // 5 minutes par défaut
    const now = Date.now()
    for (const [key, time] of accessTimes.value.entries()) {
      if (now - time > maxAge) {
        cache.value.delete(key)
        accessTimes.value.delete(key)
      }
    }
  }

  // Nettoyage automatique périodique
  let cleanupInterval
  
  onBeforeUnmount(() => {
    if (cleanupInterval) {
      clearInterval(cleanupInterval)
    }
    cache.value.clear()
    accessTimes.value.clear()
  })

  // Nettoyer le cache toutes les 5 minutes
  cleanupInterval = setInterval(cleanOldEntries, 5 * 60 * 1000)

  return {
    addToCache,
    getFromCache,
    cleanOldEntries,
    clearCache: () => {
      cache.value.clear()
      accessTimes.value.clear()
    }
  }
} 