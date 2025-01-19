import { ref, computed } from 'vue'
import { useCacheManager } from './useCacheManager'

export function useValidation(options = {}) {
  const {
    maxCacheSize = 50,
    maxMessageLength = 100,
    batchSize = 5,  // Taille des lots pour la validation
    preloadDepth = 3  // Nombre de caractères à pré-charger
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

  const preloadValidations = (expected, currentInput) => {
    // Pré-calcule les validations probables pour les prochains caractères
    for (let i = 1; i <= preloadDepth; i++) {
      const possibleInput = currentInput + expected.charAt(currentInput.length + i - 1)
      const cacheKey = `${possibleInput}-${expected}`
      
      if (!validationCache.getFromCache(cacheKey)) {
        const result = {
          isCorrect: possibleInput === expected,
          isIncorrect: false,
          isPartiallyCorrect: expected.startsWith(possibleInput),
          message: '',
          isComplete: false
        }
        validationCache.addToCache(cacheKey, result)
      }
    }
  }

  const validateBatch = (input, expected, startIndex, batchSize) => {
    const endIndex = Math.min(startIndex + batchSize, input.length)
    const inputBatch = input.slice(startIndex, endIndex)
    const expectedBatch = expected.slice(startIndex, endIndex)
    
    const memoKey = `${inputBatch}-${expectedBatch}`
    if (memoCache.has(memoKey)) {
      return memoCache.get(memoKey)
    }

    const result = inputBatch === expectedBatch
    memoCache.set(memoKey, result)
    return result
  }

  const validateInput = (input, expected, options = {}) => {
    const {
      isLastItem = false,
      successMessage = '',
      completeMessage = '',
      nextMessage = ''
    } = options

    // Optimisation : vérifie si l'entrée n'a pas changé significativement
    if (input === lastValidInput.value) {
      return memoizedValidation.value
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

    // Validation par lots pour les entrées longues
    if (input.length > batchSize) {
      let isValid = true
      for (let i = 0; i < input.length; i += batchSize) {
        if (!validateBatch(input, expected, i, batchSize)) {
          isValid = false
          break
        }
      }
      
      if (!isValid && input) {
        const result = {
          isCorrect: false,
          isIncorrect: true,
          isPartiallyCorrect: expected.startsWith(input),
          message: `Vous avez écrit : "${input.slice(0, maxMessageLength)}"
          Attendu : "${expected.slice(0, Math.min(input.length, maxMessageLength))}"`,
          isComplete: false
        }
        validationCache.addToCache(cacheKey, result)
        updateState(result)
        return result
      }
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

    // Mise à jour du cache et de l'état
    validationCache.addToCache(cacheKey, result)
    updateState(result)
    lastValidInput.value = input

    // Pré-chargement des validations probables
    if (!result.isCorrect && result.isPartiallyCorrect) {
      preloadValidations(expected, input)
    }

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