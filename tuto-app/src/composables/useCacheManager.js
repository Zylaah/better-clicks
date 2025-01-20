import { ref } from 'vue'

export function useCacheManager(maxEntries = 100) {
  const cache = ref(new Map())
  const accessTimes = ref(new Map())
  const priorities = ref(new Map())
  let cleanupInterval = null
  
  const enforceMaxEntries = () => {
    if (cache.value.size <= maxEntries) return

    // Trier les entrées par priorité (plus haute) et temps d'accès (plus récent)
    const entries = Array.from(accessTimes.value.entries()).map(([key, time]) => ({
      key,
      time,
      priority: priorities.value.get(key) || 0
    }))

    entries.sort((a, b) => {
      // D'abord comparer les priorités (priorité plus haute = garder)
      const priorityDiff = b.priority - a.priority
      if (priorityDiff !== 0) return priorityDiff
      
      // Si même priorité, comparer les temps d'accès
      return b.time - a.time
    })
    
    // Supprimer les entrées les moins prioritaires/plus anciennes
    const entriesToRemove = entries.slice(maxEntries)
    entriesToRemove.forEach(({ key }) => {
      cache.value.delete(key)
      accessTimes.value.delete(key)
      priorities.value.delete(key)
    })
  }

  const startCleanupInterval = (interval = 5 * 60 * 1000) => {
    stopCleanupInterval()
    cleanupInterval = setInterval(() => cleanOldEntries(), interval)
  }

  const stopCleanupInterval = () => {
    if (cleanupInterval) {
      clearInterval(cleanupInterval)
      cleanupInterval = null
    }
  }

  const addToCache = (key, value, priority = 0) => {
    const now = Date.now()
    cache.value.set(key, value)
    accessTimes.value.set(key, now)
    priorities.value.set(key, priority)
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
    const entries = Array.from(accessTimes.value.entries())
    
    entries.forEach(([key, time]) => {
      const age = now - time
      const priority = priorities.value.get(key) || 0
      
      // Les entrées de haute priorité ont un TTL plus long
      const adjustedMaxAge = maxAge * (1 + priority * 0.5)
      
      if (age > adjustedMaxAge) {
        cache.value.delete(key)
        accessTimes.value.delete(key)
        priorities.value.delete(key)
      }
    })
  }

  const clearCache = () => {
    cache.value.clear()
    accessTimes.value.clear()
    priorities.value.clear()
    stopCleanupInterval()
  }

  const getCacheSize = () => cache.value.size

  const getCacheStats = () => ({
    size: cache.value.size,
    oldestEntry: Math.min(...accessTimes.value.values()),
    newestEntry: Math.max(...accessTimes.value.values()),
    averagePriority: Array.from(priorities.value.values()).reduce((a, b) => a + b, 0) / priorities.value.size || 0
  })

  // Démarrer le nettoyage automatique
  startCleanupInterval()

  return {
    addToCache,
    getFromCache,
    cleanOldEntries,
    clearCache,
    stopCleanupInterval,
    getCacheSize,
    getCacheStats
  }
} 