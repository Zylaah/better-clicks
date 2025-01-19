import { ref, computed, shallowRef, markRaw } from 'vue'
import { useKeyboardStore } from '@/stores/keyboard'
import { storeToRefs } from 'pinia'
import { useOptimizedAnimations } from './useOptimizedAnimations'
import { useDebounce } from './useDebounce'
import { useValidation } from './useValidation'
import { useKeyboardEvents } from './useKeyboardEvents'
import { useIndexedDBCache } from './useIndexedDBCache'
import { usePersistence } from './usePersistence'

export function useKeyboardExercise(options = {}) {
  const {
    cacheSize = 50,
    preloadCount = 5, // Number of items to preload
    batchSize = 20 // Number of items to process at once
  } = options

  // Store setup
  const store = useKeyboardStore()
  const { typingSpeed } = storeToRefs(store)

  // Composables with performance optimizations
  const { animationClasses } = useOptimizedAnimations()
  const { debounce, clearDebounces } = useDebounce()
  const validation = markRaw(useValidation({ maxMemoryEntries: cacheSize }))
  const keyboardEvents = markRaw(useKeyboardEvents())
  const highlightedKeysCache = markRaw(useIndexedDBCache({
    maxMemoryEntries: 20,
    syncInterval: 5000,
    maxAge: 5 * 60 * 1000
  }))
  const persistence = markRaw(usePersistence(exerciseType))

  // Common state with optimizations
  const userInput = ref('')
  const currentIndex = ref(0)
  const items = shallowRef([]) // Using shallowRef for better performance with large arrays
  const processedItems = shallowRef([]) // Store processed items for better performance

  // Memoized computed properties
  const currentItem = computed(() => {
    const index = currentIndex.value
    if (!items.value || !items.value[index]) {
      return null
    }
    if (!processedItems.value[index]) {
      const item = items.value[index]
      processedItems.value[index] = item ? markRaw(item) : null
    }
    return processedItems.value[index]
  })

  const isLastItem = computed(() => {
    return currentIndex.value === (items.value?.length || 0) - 1
  })

  // Preload next batch of items
  const preloadNextItems = () => {
    const start = currentIndex.value + 1
    const end = Math.min(start + preloadCount, items.value.length)
    
    for (let i = start; i < end; i++) {
      if (!processedItems.value[i]) {
        processedItems.value[i] = markRaw(items.value[i])
      }
    }
  }

  // Process items in batches for better performance
  const processBatch = (startIndex) => {
    const endIndex = Math.min(startIndex + batchSize, items.value.length)
    for (let i = startIndex; i < endIndex; i++) {
      if (!processedItems.value[i]) {
        processedItems.value[i] = markRaw(items.value[i])
      }
    }
  }

  // Optimized input checking
  const checkInput = async (input, expected, options = {}) => {
    const result = await validation.validateInput(input, expected, {
      isLastItem: isLastItem.value,
      ...options
    })

    if (result.isCorrect) {
      // Sauvegarder les statistiques
      await persistence.saveStats({
        input,
        expected,
        isCorrect: true,
        timestamp: Date.now(),
        typingSpeed: typingSpeed.value
      })

      // Mettre à jour la progression
      const completionRate = ((currentIndex.value + 1) / items.value.length) * 100
      await persistence.saveProgress({
        completionRate,
        currentIndex: currentIndex.value,
        typingSpeed: typingSpeed.value
      })

      if (isLastItem.value && input === expected) {
        validation.isExerciseComplete.value = true
        validation.validationMessage.value = options.completeMessage || 'Exercice terminé !'
        validation.isCorrect.value = true
        validation.isIncorrect.value = false
        keyboardEvents.removeEnterKeyListener()
      } else if (!isLastItem.value) {
        keyboardEvents.removeEnterKeyListener() // Remove any existing listener first
        keyboardEvents.addEnterKeyListener(() => {
          if (currentIndex.value < items.value.length - 1) {
            currentIndex.value++
            userInput.value = ''
            validation.isCorrect.value = false
            validation.validationMessage.value = ''
            // Preload next items when moving forward
            preloadNextItems()
          }
        })
      }
    } else {
      // Sauvegarder les statistiques d'erreur
      await persistence.saveStats({
        input,
        expected,
        isCorrect: false,
        timestamp: Date.now(),
        typingSpeed: typingSpeed.value
      })
    }

    return result
  }

  // Optimized exercise reset
  const resetExercise = (newItems) => {
    items.value = newItems
    processedItems.value = []
    currentIndex.value = 0
    userInput.value = ''
    validation.resetValidation()
    store.reset()
    
    // Process first batch of items
    processBatch(0)
  }

  // Enhanced cleanup
  const cleanup = () => {
    clearDebounces()
    store.reset()
    highlightedKeysCache.clearCache()
    items.value = []
    processedItems.value = []
    userInput.value = ''
    currentIndex.value = 0
  }

  return {
    // State
    userInput,
    currentIndex,
    items,
    
    // Computed
    currentItem,
    isLastItem,
    
    // Store refs
    typingSpeed,
    
    // Composables exports
    animationClasses,
    keyboardEvents,
    highlightedKeysCache,
    
    // Validation exports
    ...validation,
    
    // Persistence exports
    ...persistence,
    
    // Methods
    checkInput,
    resetExercise,
    cleanup,
    
    // Debounce helper
    debounce
  }
} 