import { useCacheManager } from './useCacheManager'
import { WordGenerator } from '@/services/wordGenerator'
import { LetterGenerator } from '@/services/letterGenerator'
import { SymbolGenerator } from '@/services/symbolGenerator'
import { PhraseGenerator } from '@/services/phraseGenerator'

export function useExerciseCache() {
  // Un seul cache manager pour tous les types d'exercices
  const cacheManager = useCacheManager(200)

  const getItems = (type, count = 20, forceRefresh = false) => {
    const cacheKey = `${type}-${count}`
    
    if (!forceRefresh) {
      const cached = cacheManager.getFromCache(cacheKey)
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

    cacheManager.addToCache(cacheKey, items)
    return [...items]
  }

  const refreshCache = (type, count = 20) => {
    return getItems(type, count, true)
  }

  const cleanup = () => {
    cacheManager.cleanOldEntries()
    cacheManager.stopCleanupInterval()
  }

  return {
    getItems,
    refreshCache,
    cleanup
  }
}