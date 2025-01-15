import { ref, computed } from 'vue'
import { useCacheManager } from './useCacheManager'

export function useValidation(options = {}) {
  const {
    maxCacheSize = 50,
    maxMessageLength = 100
  } = options

  const validationCache = useCacheManager(maxCacheSize)
  const isCorrect = ref(false)
  const isIncorrect = ref(false)
  const validationMessage = ref('')
  const isExerciseComplete = ref(false)

  const validateInput = (input, expected, options = {}) => {
    const {
      isLastItem = false,
      successMessage = 'Parfait !',
      completeMessage = 'Parfait ! Vous avez terminé !',
      nextMessage = 'Appuyez sur Entrée pour continuer.'
    } = options

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
    validationCache.clearCache()
  }

  const validationState = computed(() => ({
    isCorrect: isCorrect.value,
    isIncorrect: isIncorrect.value,
    message: validationMessage.value,
    isComplete: isExerciseComplete.value
  }))

  return {
    validateInput,
    resetValidation,
    validationState,
    isCorrect,
    isIncorrect,
    validationMessage,
    isExerciseComplete
  }
} 