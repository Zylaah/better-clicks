import { ref, computed, shallowRef, markRaw, onBeforeUnmount } from 'vue'
import { useKeyboardStore } from '@/stores/keyboard'
import { storeToRefs } from 'pinia'
import { useOptimizedAnimations } from './useOptimizedAnimations'
import { useDebounce } from './useDebounce'
import { useValidation } from './useValidation'
import { useKeyboardEvents } from './useKeyboardEvents'
import { useCacheManager } from './useCacheManager'

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
  const validation = markRaw(useValidation({ maxCacheSize: cacheSize }))
  const keyboardEvents = markRaw(useKeyboardEvents())
  const highlightedKeysCache = markRaw(useCacheManager(20))

  // Common state with optimizations
  const userInput = ref('')
  const currentIndex = ref(0)
  const items = shallowRef([]) // Using shallowRef for better performance with large arrays
  const processedItems = shallowRef([]) // Store processed items for better performance

  // Memoized computed properties
  const currentItem = computed(() => {
    const index = currentIndex.value
    const item = items.value[index]
    
    if (!processedItems.value[index] && item) {
      processedItems.value[index] = markRaw(item)
    }
    
    return processedItems.value[index] || null
  })

  const isLastItem = computed(() => {
    return currentIndex.value === items.value.length - 1
  })

  // Preload next batch of items
  const preloadNextItems = () => {
    const start = currentIndex.value + 1
    const end = Math.min(start + preloadCount, items.value.length)
    
    for (let i = start; i < end; i++) {
      const item = items.value[i]
      if (!processedItems.value[i] && item) {
        processedItems.value[i] = markRaw(item)
      }
    }
  }

  // Process items in batches for better performance
  const processBatch = (startIndex) => {
    const endIndex = Math.min(startIndex + batchSize, items.value.length)
    for (let i = startIndex; i < endIndex; i++) {
      const item = items.value[i]
      if (!processedItems.value[i] && item) {
        processedItems.value[i] = markRaw(item)
      }
    }
  }

  // Optimized input checking
  const checkInput = (input, expected, options = {}) => {
    const result = validation.validateInput(input, expected, {
      isLastItem: isLastItem.value,
      ...options
    })

    if (result.isCorrect && !result.isComplete) {
      keyboardEvents.addEnterKeyListener(() => {
        if (currentIndex.value < items.value.length - 1) {
          currentIndex.value++
          validation.isCorrect.value = false
          validation.validationMessage.value = ''
          userInput.value = ''
          // Preload next items when moving forward
          preloadNextItems()
        }
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

    window.removeEventListener('keydown', debouncedCheck)
    window.removeEventListener('keyup', debouncedCheck)
  }

  const cleanupMemory = () => {
    items.value = null
    processedItems.value = null
    currentItem.value = null

    if (window.gc) window.gc()
  }

  // Fonction de vérification
  const checkPhrase = () => {
    if (!currentItem.value) return
    
    const result = validation.validateInput(userInput.value, currentItem.value, {
      isLastItem: isLastItem.value,
      successMessage: 'Correct !',
      completeMessage: 'Exercice terminé !',
      nextMessage: 'Passez à la suite'
    })

    validation.isCorrect.value = result.isCorrect
    validation.isIncorrect.value = result.isIncorrect
    validation.validationMessage.value = result.message
    validation.isExerciseComplete.value = result.isComplete
  }

  const debouncedCheck = computed(() => 
    debounce((event) => {
      // Ne vérifier que sur la touche Entrée
      if (event.key === 'Enter') {
        if (!event?.target?.value) return
        userInput.value = event.target.value
        checkPhrase()
      }
    }, 50) // Réduire le délai de debounce
  ).value

  // Nettoyage
  onBeforeUnmount(() => {
    debouncedCheck.cancel && debouncedCheck.cancel()
  })

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
    
    // Methods
    checkInput,
    resetExercise,
    cleanup,
    cleanupMemory,

    // Debounce helper
    debounce,
    checkPhrase,
    debouncedCheck
  }
} 