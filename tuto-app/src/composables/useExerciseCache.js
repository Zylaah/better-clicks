import { useCacheManager } from './useCacheManager'
import { useIndexedDB } from './useIndexedDB'
import { WordGenerator } from '@/services/wordGenerator'
import { LetterGenerator } from '@/services/letterGenerator'
import { SymbolGenerator } from '@/services/symbolGenerator'
import { PhraseGenerator } from '@/services/phraseGenerator'
import { ref, onBeforeUnmount } from 'vue'

// Configuration du cache
const CACHE_CONFIG = {
  MAX_CACHE_SIZE: 100,
  MAX_ITEMS_PER_TYPE: 50,
  CACHE_TTL: 30 * 60 * 1000, // 30 minutes en millisecondes
  PRELOAD_BATCH_SIZE: 5,
  EXERCISE_TYPES: {
    lettres: { priority: 1, defaultCount: 36 },
    mots: { priority: 2, defaultCount: 20 },
    phrases: { priority: 3, defaultCount: 10 },
    symboles: { priority: 4, defaultCount: 20 }
  }
}

export function useExerciseCache() {
  const cacheManager = useCacheManager(CACHE_CONFIG.MAX_CACHE_SIZE)
  const { isReady, hasError, getFromStore, setInStore, STORES } = useIndexedDB()
  const fallbackMode = ref(false)
  const cacheStats = ref({
    hits: 0,
    misses: 0,
    totalRequests: 0
  })

  // Fonction utilitaire pour générer des items avec gestion d'erreur améliorée
  const generateItems = (type, count) => {
    try {
      const config = CACHE_CONFIG.EXERCISE_TYPES[type]
      if (!config) {
        throw new Error(`Type d'exercice non supporté: ${type}`)
      }

      const safeCount = Math.min(count, CACHE_CONFIG.MAX_ITEMS_PER_TYPE)
      
      switch (type) {
        case 'mots':
          return WordGenerator.generateRandomWords(safeCount)
        case 'lettres':
          return LetterGenerator.generateRandomLetters(safeCount)
        case 'symboles':
          return SymbolGenerator.generateRandomSymbols(safeCount)
        case 'phrases':
          return PhraseGenerator.generateRandomPhrases(safeCount)
        default:
          return []
      }
    } catch (error) {
      console.error(`Erreur lors de la génération des items de type ${type}:`, error)
      return []
    }
  }

  const updateCacheStats = (isHit) => {
    cacheStats.value.totalRequests++
    if (isHit) {
      cacheStats.value.hits++
    } else {
      cacheStats.value.misses++
    }
  }

  const getItems = async (type, count = 20, forceRefresh = false) => {
    try {
      const config = CACHE_CONFIG.EXERCISE_TYPES[type]
      if (!config) {
        throw new Error(`Type d'exercice non supporté: ${type}`)
      }

      const safeCount = Math.min(count, CACHE_CONFIG.MAX_ITEMS_PER_TYPE)
      const cacheKey = `${type}-${safeCount}`

      // Vérifier le cache mémoire en premier
      if (!forceRefresh) {
        const memoryCache = cacheManager.getFromCache(cacheKey)
        if (memoryCache?.length === safeCount) {
          updateCacheStats(true)
          return [...memoryCache]
        }
      }

      // Vérifier IndexedDB si disponible
      if (isReady.value && !hasError.value && !fallbackMode.value && !forceRefresh) {
        try {
          const dbCache = await getFromStore(STORES.exerciseCache, cacheKey)
          if (dbCache?.items?.length === safeCount && 
              Date.now() - dbCache.timestamp < CACHE_CONFIG.CACHE_TTL) {
            cacheManager.addToCache(cacheKey, dbCache.items, config.priority)
            updateCacheStats(true)
            return [...dbCache.items]
          }
        } catch (error) {
          console.warn('Erreur lors de la lecture depuis IndexedDB:', error)
          fallbackMode.value = true
        }
      }

      // Générer de nouveaux items
      updateCacheStats(false)
      const items = generateItems(type, safeCount)
      if (items.length === 0) {
        throw new Error(`Impossible de générer les items de type ${type}`)
      }

      // Mettre en cache
      const cacheEntry = {
        id: cacheKey,
        items,
        timestamp: Date.now(),
        type,
        priority: config.priority
      }

      cacheManager.addToCache(cacheKey, items, config.priority)

      // Sauvegarder dans IndexedDB si possible
      if (isReady.value && !hasError.value && !fallbackMode.value) {
        setInStore(STORES.exerciseCache, cacheEntry).catch(error => {
          console.warn('Erreur lors de la sauvegarde dans IndexedDB:', error)
          fallbackMode.value = true
        })
      }

      return [...items]
    } catch (error) {
      console.error('Erreur critique dans getItems:', error)
      return []
    }
  }

  const preloadNextExercises = async (type, currentIndex, count = CACHE_CONFIG.PRELOAD_BATCH_SIZE) => {
    if (!CACHE_CONFIG.EXERCISE_TYPES[type]) return

    try {
      const cacheKey = `${type}-next-${currentIndex}`
      if (cacheManager.getFromCache(cacheKey)) return

      // Utiliser requestIdleCallback pour le préchargement
      const preloadFunc = async () => {
        const items = await getItems(type, count)
        if (items.length > 0) {
          const config = CACHE_CONFIG.EXERCISE_TYPES[type]
          cacheManager.addToCache(cacheKey, items, config.priority)
        }
      }

      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => preloadFunc())
      } else {
        setTimeout(preloadFunc, 1000)
      }
    } catch (error) {
      console.warn('Erreur lors du préchargement:', error)
    }
  }

  const preloadInitialExercises = async (types = Object.keys(CACHE_CONFIG.EXERCISE_TYPES)) => {
    try {
      const preloadPromises = types.map(type => {
        const config = CACHE_CONFIG.EXERCISE_TYPES[type]
        return getItems(type, config.defaultCount, true)
      })
      
      await Promise.all(preloadPromises)
    } catch (error) {
      console.error('Erreur lors du préchargement initial:', error)
    }
  }

  const refreshCache = async (type, count) => {
    try {
      const config = CACHE_CONFIG.EXERCISE_TYPES[type]
      return await getItems(type, count || config.defaultCount, true)
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du cache:', error)
      return []
    }
  }

  const cleanup = () => {
    try {
      cacheManager.cleanOldEntries(CACHE_CONFIG.CACHE_TTL)
      cacheManager.stopCleanupInterval()
    } catch (error) {
      console.warn('Erreur lors du nettoyage du cache:', error)
    }
  }

  // Nettoyage automatique avant le démontage
  onBeforeUnmount(() => {
    cleanup()
  })

  return {
    getItems,
    refreshCache,
    cleanup,
    preloadNextExercises,
    preloadInitialExercises,
    fallbackMode,
    cacheStats
  }
}