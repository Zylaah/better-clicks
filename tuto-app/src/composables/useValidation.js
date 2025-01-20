import { ref, computed } from 'vue'
import { useCacheManager } from './useCacheManager'

export function useValidation(options = {}) {
  const {
    maxCacheSize = 50,
    maxMessageLength = 100
  } = options

  const validationCache = useCacheManager({
    maxSize: maxCacheSize,
    ttl: 5 * 60 * 1000 // 5 minutes
  })
  const memoCache = new Map() // Cache pour la memoization des calculs intermédiaires
  const isCorrect = ref(false)
  const isIncorrect = ref(false)
  const validationMessage = ref('')
  const isExerciseComplete = ref(false)
  const lastValidInput = ref('')

  // Memoized computed pour les calculs fréquents
  const memoizedValidation = computed(() => ({
    isCorrect: isCorrect.value,
    isIncorrect: isIncorrect.value,
    message: validationMessage.value,
    isComplete: isExerciseComplete.value
  }))

  const validateInput = (input, expected, options = {}) => {
    const {
      isLastItem = false,
      successMessage = '',
      completeMessage = '',
      nextMessage = '',
      isEnterPressed = false,
      forceValidation = false
    } = options

    // Si ce n'est pas une validation forcée et qu'on n'appuie pas sur Entrée,
    // on retourne un résultat par défaut au lieu de null
    if (!forceValidation && !isEnterPressed) {
      return {
        isCorrect: false,
        isIncorrect: false,
        isPartiallyCorrect: expected.startsWith(input),
        message: '',
        isComplete: false
      }
    }

    const cacheKey = `${input}-${expected}`
    const cached = validationCache.getFromCache(cacheKey)
    
    if (cached) {
      isCorrect.value = cached.isCorrect
      isIncorrect.value = cached.isIncorrect
      validationMessage.value = cached.message
      isExerciseComplete.value = cached.isComplete
      return cached
    }

    const result = {
      isCorrect: input === expected,
      isIncorrect: false,
      isPartiallyCorrect: expected.startsWith(input),
      message: '',
      isComplete: false
    }

    if (result.isCorrect) {
      result.message = isLastItem ? completeMessage : `${successMessage} ${nextMessage}`
      result.isComplete = isLastItem
    } else {
      result.isIncorrect = !result.isPartiallyCorrect
      if (!result.isPartiallyCorrect && input) {
        result.message = `Vous avez écrit : "${input.slice(0, maxMessageLength)}"
        Attendu : "${expected.slice(0, Math.min(input.length, maxMessageLength))}"`
      }
    }

    // Met à jour l'état
    isCorrect.value = result.isCorrect
    isIncorrect.value = result.isIncorrect
    validationMessage.value = result.message
    isExerciseComplete.value = result.isComplete

    // Met en cache le résultat
    validationCache.addToCache(cacheKey, result)

    return result
  }

  const resetValidation = () => {
    isCorrect.value = false
    isIncorrect.value = false
    validationMessage.value = ''
    isExerciseComplete.value = false
    lastValidInput.value = ''
    memoCache.clear()
    validationCache.clearCache()
  }

  return {
    validateInput,
    resetValidation,
    validationState: memoizedValidation,
    isCorrect,
    isIncorrect,
    validationMessage,
    isExerciseComplete
  }
} 