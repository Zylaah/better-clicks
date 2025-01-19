import { useIndexedDBCache } from './useIndexedDBCache'
import { WordGenerator } from '@/services/wordGenerator'
import { LetterGenerator } from '@/services/letterGenerator'
import { SymbolGenerator } from '@/services/symbolGenerator'
import { PhraseGenerator } from '@/services/phraseGenerator'

export function useExerciseCache() {
  const cacheManager = useIndexedDBCache({
    maxMemoryEntries: 200,
    syncInterval: 10000, // 10 secondes
    maxAge: 30 * 60 * 1000 // 30 minutes
  })

  const getItems = async (type, count = 20, forceRefresh = false) => {
    const cacheKey = `exercise-${type}-${count}`
    
    if (!forceRefresh) {
      const cached = await cacheManager.getFromCache(cacheKey)
      if (cached?.length === count) return [...cached]
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
    return [...itemsWithMetadata]
  }

  const refreshCache = async (type, count = 20) => {
    return getItems(type, count, true)
  }

  const cleanup = () => {
    cacheManager.cleanOldEntries()
    cacheManager.stopSync()
  }

  return {
    getItems,
    refreshCache,
    cleanup
  }
}