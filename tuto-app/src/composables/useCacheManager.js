import { ref } from 'vue'

export function useCacheManager(maxEntries = 100) {
  const cache = ref(new Map())
  const accessTimes = ref(new Map())
  let cleanupInterval = null
  
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

  const startCleanupInterval = () => {
    cleanupInterval = setInterval(() => cleanOldEntries(), 5 * 60 * 1000)
  }

  const stopCleanupInterval = () => {
    if (cleanupInterval) {
      clearInterval(cleanupInterval)
      cleanupInterval = null
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

  const cleanOldEntries = (maxAge = 5 * 60 * 1000) => {
    const now = Date.now()
    for (const [key, time] of accessTimes.value.entries()) {
      if (now - time > maxAge) {
        cache.value.delete(key)
        accessTimes.value.delete(key)
      }
    }
  }

  const clearCache = () => {
    cache.value.clear()
    accessTimes.value.clear()
    stopCleanupInterval()
  }

  startCleanupInterval()

  return {
    addToCache,
    getFromCache,
    cleanOldEntries,
    clearCache,
    stopCleanupInterval
  }
} 