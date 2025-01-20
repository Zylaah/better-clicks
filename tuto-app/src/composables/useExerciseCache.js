import { useCacheManager } from './useCacheManager'
import { useIndexedDB } from './useIndexedDB'
import { WordGenerator } from '@/services/wordGenerator'
import { LetterGenerator } from '@/services/letterGenerator'
import { SymbolGenerator } from '@/services/symbolGenerator'
import { PhraseGenerator } from '@/services/phraseGenerator'
import { ref } from 'vue'

const MAX_CACHE_SIZE = 100
const MAX_ITEMS_PER_TYPE = 50

export function useExerciseCache() {
  const cacheManager = useCacheManager(200)
  const { isReady, hasError, getFromStore, setInStore, STORES } = useIndexedDB()
  const fallbackMode = ref(false)

  // Fonction utilitaire pour générer des items
  const generateItems = (type, count) => {
    try {
      switch (type) {
        case 'mots':
          return WordGenerator.generateRandomWords(count)
        case 'lettres':
          return LetterGenerator.generateRandomLetters(count)
        case 'symboles':
          return SymbolGenerator.generateRandomSymbols(count)
        case 'phrases':
          return PhraseGenerator.generateRandomPhrases(count)
        default:
          throw new Error(`Type d'exercice non supporté: ${type}`)
      }
    } catch (error) {
      console.error(`Erreur lors de la génération des items de type ${type}:`, error)
      return []
    }
  }

  const getItems = async (type, count = 20, forceRefresh = false) => {
    // Nettoyer le cache si nécessaire
    if (cacheManager.size > MAX_CACHE_SIZE) {
      cacheManager.cleanup()
    }
    
    // Limiter le nombre d'items par type
    const safeCount = Math.min(count, MAX_ITEMS_PER_TYPE)
    const cacheKey = `${type}-${safeCount}`
    
    try {
      // Vérifier d'abord le cache en mémoire pour une réponse rapide
      if (!forceRefresh) {
        const memoryCache = cacheManager.getFromCache(cacheKey)
        if (memoryCache?.length === safeCount) {
          return [...memoryCache]
        }
      }

      // Si IndexedDB est disponible et qu'on n'est pas en mode fallback
      if (isReady.value && !hasError.value && !fallbackMode.value && !forceRefresh) {
        try {
          const dbCache = await getFromStore(STORES.exerciseCache, cacheKey)
          if (dbCache?.items?.length === safeCount) {
            // Mettre en cache mémoire pour les prochains accès
            cacheManager.addToCache(cacheKey, dbCache.items)
            return [...dbCache.items]
          }
        } catch (error) {
          console.warn('Erreur lors de la lecture depuis IndexedDB, passage en mode fallback:', error)
          fallbackMode.value = true
        }
      }

      // Générer de nouveaux items
      const items = generateItems(type, safeCount)
      if (items.length === 0) {
        throw new Error(`Impossible de générer les items de type ${type}`)
      }

      // Sauvegarder dans le cache mémoire
      cacheManager.addToCache(cacheKey, items)

      // Tenter de sauvegarder dans IndexedDB si disponible
      if (isReady.value && !hasError.value && !fallbackMode.value) {
        setInStore(STORES.exerciseCache, {
          id: cacheKey,
          items,
          timestamp: Date.now()
        }).catch(error => {
          console.warn('Erreur lors de la sauvegarde dans IndexedDB:', error)
          fallbackMode.value = true
        })
      }

      return [...items]
    } catch (error) {
      console.error('Erreur critique dans getItems:', error)
      // En cas d'erreur critique, on retourne un tableau vide
      // Le composant devra gérer ce cas
      return []
    }
  }

  const refreshCache = async (type, count = 20) => {
    try {
      return await getItems(type, count, true)
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du cache:', error)
      return []
    }
  }

  const cleanup = () => {
    try {
      cacheManager.cleanOldEntries()
      cacheManager.stopCleanupInterval()
    } catch (error) {
      console.warn('Erreur lors du nettoyage du cache:', error)
    }
  }

  // Précharger les prochains exercices
  const preloadNextExercises = async (type, currentIndex, count = 5) => {
    try {
      // Calculer l'index de début pour le prochain lot
      const startIndex = currentIndex + 1
      const endIndex = startIndex + count

      // Vérifier si nous avons déjà ces exercices en cache
      const cacheKey = `${type}-${startIndex}-${endIndex}`
      if (cacheManager.getFromCache(cacheKey)) {
        return // Déjà préchargé
      }

      // Charger le prochain lot d'exercices en arrière-plan
      if ('requestIdleCallback' in window) {
        requestIdleCallback(async () => {
          const nextItems = await getItems(type, count)
          cacheManager.addToCache(cacheKey, nextItems)
        })
      } else {
        // Fallback pour les navigateurs ne supportant pas requestIdleCallback
        setTimeout(async () => {
          const nextItems = await getItems(type, count)
          cacheManager.addToCache(cacheKey, nextItems)
        }, 1000)
      }
    } catch (error) {
      console.warn('Erreur lors du préchargement:', error)
    }
  }

  // Précharger les exercices initiaux
  const preloadInitialExercises = async (types = ['lettres', 'mots', 'phrases', 'symboles']) => {
    try {
      const preloadPromises = types.map(type => 
        getItems(type, 10, true) // Force le rechargement initial
      )
      
      await Promise.all(preloadPromises)
    } catch (error) {
      console.error('Erreur lors du préchargement initial:', error)
    }
  }

  return {
    getItems,
    refreshCache,
    cleanup,
    fallbackMode,
    preloadNextExercises,
    preloadInitialExercises
  }
}