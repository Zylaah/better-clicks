import { useIndexedDBCache } from './useIndexedDBCache'
import { WordGenerator } from '@/services/wordGenerator'
import { LetterGenerator } from '@/services/letterGenerator'
import { SymbolGenerator } from '@/services/symbolGenerator'
import { PhraseGenerator } from '@/services/phraseGenerator'
import { ref } from 'vue'

export function useExerciseCache() {
  const cacheManager = useIndexedDBCache({
    maxMemoryEntries: 200,
    syncInterval: 10000, // 10 secondes
    maxAge: 30 * 60 * 1000 // 30 minutes
  })

  // Cache pour le préchargement
  const preloadCache = ref(new Map())
  const isPreloading = ref(false)

  const preloadNextExercise = async (currentType) => {
    if (isPreloading.value) return
    isPreloading.value = true

    try {
      const nextType = getNextExerciseType(currentType)
      if (!nextType) {
        isPreloading.value = false
        return
      }

      const cacheKey = `exercise-${nextType}-20`
      if (!preloadCache.value.has(cacheKey)) {
        const items = await getItems(nextType, 20, false)
        preloadCache.value.set(cacheKey, items)
      }
    } catch (error) {
      console.error('Erreur lors du préchargement:', error)
    } finally {
      isPreloading.value = false
    }
  }

  const getNextExerciseType = (currentType) => {
    const types = ['lettres', 'symboles', 'mots', 'phrases']
    const currentIndex = types.indexOf(currentType)
    return currentIndex >= 0 && currentIndex < types.length - 1 
      ? types[currentIndex + 1] 
      : null
  }

  const getItems = async (type, count = 20, forceRefresh = false) => {
    const cacheKey = `exercise-${type}-${count}`
    
    // Vérifier d'abord le cache de préchargement
    if (!forceRefresh && preloadCache.value.has(cacheKey)) {
      const preloadedItems = preloadCache.value.get(cacheKey)
      preloadCache.value.delete(cacheKey) // Nettoyer après utilisation
      return [...preloadedItems]
    }
    
    if (!forceRefresh) {
      const cached = await cacheManager.getFromCache(cacheKey)
      if (cached?.length === count) {
        // Précharger le prochain exercice pendant que l'utilisateur travaille
        preloadNextExercise(type)
        return [...cached]
      }
    }

    let items
    switch (type) {
      case 'mots':
        items = WordGenerator.generateRandomWords(count)
        break
      case 'lettres':
        items = LetterGenerator.generateRandomLetters(count)
        break
      case 'symboles':
        items = SymbolGenerator.generateRandomSymbols(count)
        break
      case 'phrases':
        items = PhraseGenerator.generateRandomPhrases(count)
        break
      default:
        throw new Error(`Type d'exercice non supporté: ${type}`)
    }

    // Ajoute les métadonnées nécessaires pour IndexedDB
    const itemsWithMetadata = items.map(item => ({
      ...item,
      type,
      timestamp: Date.now()
    }))

    await cacheManager.addToCache(cacheKey, itemsWithMetadata)
    
    // Précharger le prochain exercice
    preloadNextExercise(type)
    
    return [...itemsWithMetadata]
  }

  const refreshCache = async (type, count = 20) => {
    preloadCache.value.clear() // Nettoyer le cache de préchargement
    return getItems(type, count, true)
  }

  const cleanup = () => {
    preloadCache.value.clear()
    cacheManager.cleanOldEntries()
    cacheManager.stopSync()
  }

  return {
    getItems,
    refreshCache,
    cleanup,
    preloadNextExercise
  }
}