import { ref } from 'vue'

export function useCacheManager(maxSize = 100) {
  const cacheSize = ref(0)
  const cacheEntries = ref(new Map())

  const addToCache = (key, value) => {
    if (cacheSize.value >= maxSize) {
      // Supprime les entrées les plus anciennes
      const entriesToDelete = Math.ceil(maxSize * 0.2) // Supprime 20% du cache
      const entries = Array.from(cacheEntries.value.entries())
      entries.slice(0, entriesToDelete).forEach(([k]) => {
        cacheEntries.value.delete(k)
        cacheSize.value--
      })
    }

    cacheEntries.value.set(key, {
      value,
      timestamp: Date.now()
    })
    cacheSize.value++
  }

  const getFromCache = (key) => {
    const entry = cacheEntries.value.get(key)
    if (entry) {
      // Met à jour le timestamp pour garder l'entrée "fraîche"
      entry.timestamp = Date.now()
      return entry.value
    }
    return null
  }

  const clearCache = () => {
    cacheEntries.value.clear()
    cacheSize.value = 0
  }

  const cleanOldEntries = (maxAge = 1000 * 60 * 5) => { // 5 minutes par défaut
    const now = Date.now()
    for (const [key, entry] of cacheEntries.value.entries()) {
      if (now - entry.timestamp > maxAge) {
        cacheEntries.value.delete(key)
        cacheSize.value--
      }
    }
  }

  return {
    addToCache,
    getFromCache,
    clearCache,
    cleanOldEntries,
    cacheSize
  }
} 