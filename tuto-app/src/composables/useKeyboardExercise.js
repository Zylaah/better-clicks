import { ref, computed } from 'vue'
import { useKeyboardStore } from '@/stores/keyboard'
import { storeToRefs } from 'pinia'
import { useOptimizedAnimations } from './useOptimizedAnimations'
import { useDebounce } from './useDebounce'
import { useValidation } from './useValidation'
import { useKeyboardEvents } from './useKeyboardEvents'
import { useCacheManager } from './useCacheManager'

export function useKeyboardExercise(options = {}) {
  const {
    cacheSize = 50
  } = options

  // Store setup
  const store = useKeyboardStore()
  const { typingSpeed } = storeToRefs(store)

  // Composables
  const { animationClasses } = useOptimizedAnimations()
  const { debounce, clearDebounces } = useDebounce()
  const validation = useValidation({ maxCacheSize: cacheSize })
  const keyboardEvents = useKeyboardEvents()
  const highlightedKeysCache = useCacheManager(20)

  // Common state
  const userInput = ref('')
  const currentIndex = ref(0)
  const items = ref([])

  // Computed properties
  const currentItem = computed(() => {
    return items.value[currentIndex.value] || null
  })

  const isLastItem = computed(() => {
    return currentIndex.value === items.value.length - 1
  })

  // Methods
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
        }
      })
    }

    return result
  }

  const resetExercise = (newItems) => {
    items.value = newItems
    currentIndex.value = 0
    userInput.value = ''
    validation.resetValidation()
    store.reset()
  }

  const cleanup = () => {
    clearDebounces()
    store.reset()
    highlightedKeysCache.clearCache()
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
    
    // Methods
    checkInput,
    resetExercise,
    cleanup,
    
    // Debounce helper
    debounce
  }
} 