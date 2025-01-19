import { ref, computed, shallowRef, markRaw, watchEffect, onBeforeUnmount } from 'vue'
import { useKeyboardStore } from '@/stores/keyboard'
import { storeToRefs } from 'pinia'
import { useOptimizedAnimations } from './useOptimizedAnimations'
import { useDebounce } from './useDebounce'
import { useValidation } from './useValidation'
import { useKeyboardEvents } from './useKeyboardEvents'
import { useIndexedDBCache } from './useIndexedDBCache'

export function useKeyboardExercise(options = {}) {
  const {
    cacheSize = 50,
    preloadCount = 5,
    batchSize = 20,
    cleanupInterval = 30000, // 30 secondes
    maxInactiveTime = 300000 // 5 minutes
  } = options

  // Store setup avec cleanup automatique
  const store = useKeyboardStore()
  const { typingSpeed } = storeToRefs(store)

  // Composables avec optimisations de performance
  const { animationClasses } = useOptimizedAnimations()
  const { debounce, clearDebounces } = useDebounce()
  const validation = markRaw(useValidation({ maxMemoryEntries: cacheSize }))
  const keyboardEvents = markRaw(useKeyboardEvents())
  const highlightedKeysCache = markRaw(useIndexedDBCache({
    maxMemoryEntries: 20,
    syncInterval: 5000,
    maxAge: 5 * 60 * 1000
  }))

  // État commun avec optimisations
  const userInput = ref('')
  const currentIndex = ref(0)
  const items = shallowRef([])
  const processedItems = shallowRef([])
  const lastActivityTime = ref(Date.now())
  const memoryUsage = ref({
    items: 0,
    processedItems: 0,
    cache: 0
  })

  // Surveillance de l'utilisation de la mémoire
  const updateMemoryUsage = () => {
    memoryUsage.value = {
      items: items.value.length,
      processedItems: processedItems.value.length,
      cache: highlightedKeysCache.getCacheSize?.() || 0
    }
  }

  // Nettoyage automatique des items non utilisés
  const cleanupUnusedItems = () => {
    const now = Date.now()
    if (now - lastActivityTime.value > maxInactiveTime) {
      processedItems.value = processedItems.value.filter((_, index) => {
        const distance = Math.abs(index - currentIndex.value)
        return distance <= preloadCount
      })
      updateMemoryUsage()
    }
  }

  // Gestionnaire d'activité
  const updateActivity = () => {
    lastActivityTime.value = Date.now()
  }

  // Optimisation du traitement par lots
  const processBatch = (startIndex) => {
    const endIndex = Math.min(startIndex + batchSize, items.value.length)
    const newProcessedItems = [...processedItems.value]
    
    for (let i = startIndex; i < endIndex; i++) {
      if (!newProcessedItems[i] && items.value[i]) {
        newProcessedItems[i] = markRaw(items.value[i])
      }
    }
    
    processedItems.value = newProcessedItems
    updateMemoryUsage()
  }

  // Préchargement optimisé des items suivants
  const preloadNextItems = () => {
    const start = currentIndex.value + 1
    const end = Math.min(start + preloadCount, items.value.length)
    
    // Nettoyer les items trop éloignés
    processedItems.value = processedItems.value.map((item, index) => {
      const distance = Math.abs(index - currentIndex.value)
      return distance <= preloadCount * 2 ? item : null
    })
    
    // Précharger les prochains items
    for (let i = start; i < end; i++) {
      if (!processedItems.value[i] && items.value[i]) {
        processedItems.value[i] = markRaw(items.value[i])
      }
    }
    
    updateMemoryUsage()
  }

  // Item courant avec optimisation de mémoire
  const currentItem = computed(() => {
    updateActivity()
    const index = currentIndex.value
    
    if (!items.value?.[index]) {
      return null
    }
    
    if (!processedItems.value[index]) {
      const item = items.value[index]
      processedItems.value[index] = item ? markRaw(item) : null
      updateMemoryUsage()
    }
    
    return processedItems.value[index]
  })

  const isLastItem = computed(() => {
    return currentIndex.value === (items.value?.length || 0) - 1
  })

  // Vérification optimisée des entrées
  const checkInput = async (input, expected, options = {}) => {
    updateActivity()
    const result = await validation.validateInput(input, expected, {
      isLastItem: isLastItem.value,
      ...options
    })

    if (result.isCorrect) {
      if (isLastItem.value && input === expected) {
        validation.isExerciseComplete.value = true
        validation.validationMessage.value = options.completeMessage || 'Exercice terminé !'
        validation.isCorrect.value = true
        validation.isIncorrect.value = false
        keyboardEvents.removeEnterKeyListener()
      } else if (!isLastItem.value) {
        keyboardEvents.removeEnterKeyListener()
        keyboardEvents.addEnterKeyListener(() => {
          if (currentIndex.value < items.value.length - 1) {
            currentIndex.value++
            userInput.value = ''
            validation.isCorrect.value = false
            validation.validationMessage.value = ''
            preloadNextItems()
          }
        })
      }
    }

    return result
  }

  // Réinitialisation optimisée
  const resetExercise = (newItems) => {
    items.value = newItems
    processedItems.value = new Array(newItems.length)
    currentIndex.value = 0
    userInput.value = ''
    validation.resetValidation()
    store.reset()
    
    processBatch(0)
    updateMemoryUsage()
  }

  // Nettoyage amélioré
  const cleanup = () => {
    clearDebounces()
    store.reset()
    highlightedKeysCache.clearCache()
    items.value = []
    processedItems.value = []
    userInput.value = ''
    currentIndex.value = 0
    updateMemoryUsage()
  }

  // Mise en place du nettoyage automatique
  let cleanupTimer = setInterval(cleanupUnusedItems, cleanupInterval)

  // Nettoyage des ressources
  onBeforeUnmount(() => {
    clearInterval(cleanupTimer)
    cleanup()
  })

  // Surveillance des changements d'état pour la gestion de la mémoire
  watchEffect(() => {
    if (currentItem.value) {
      updateActivity()
    }
  })

  return {
    // État
    userInput,
    currentIndex,
    items,
    memoryUsage,
    
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