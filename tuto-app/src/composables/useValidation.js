import { ref, computed } from 'vue'
import { useCacheManager } from './useCacheManager'

export function useValidation(options = {}) {
  const {
    maxCacheSize = 50,
    maxMessageLength = 100
  } = options

  const validationCache = useCacheManager(maxCacheSize)
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
      nextMessage = ''
    } = options

    // Toujours valider l'entrée, même si elle n'a pas changé
    const cacheKey = `${input}-${expected}`
    
    // Validation immédiate pour les cas simples
    const result = {
      isCorrect: input === expected,
      isIncorrect: false,
      isPartiallyCorrect: expected.startsWith(input),
      message: '',
      isComplete: false
    }

    // Gestion des messages
    if (result.isCorrect) {
      result.message = isLastItem ? completeMessage : `${successMessage} ${nextMessage}`
      result.isComplete = isLastItem
    } else if (input) {
      result.isIncorrect = !result.isPartiallyCorrect
      if (!result.isPartiallyCorrect) {
        result.message = `Vous avez écrit : "${input.slice(0, maxMessageLength)}"
        Attendu : "${expected.slice(0, Math.min(input.length, maxMessageLength))}"`
      }
    }

    // Mise à jour du cache et de l'état
    validationCache.addToCache(cacheKey, result)
    updateState(result)
    lastValidInput.value = input

    return result
  }

  const updateState = (result) => {
    isCorrect.value = result.isCorrect
    isIncorrect.value = result.isIncorrect
    validationMessage.value = result.message
    isExerciseComplete.value = result.isComplete
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