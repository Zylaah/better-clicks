<template>
  <div class="keyboard-test" :class="animationClasses">
    <GlobalKeyboard
      v-memo="[highlightedKeys, currentCharToType]"
      :show-debug-controls="true"
      :show-event-log="true"
      :max-log-entries="10"
      :highlighted-keys="highlightedKeys"
    />

    <div v-if="isLoading" class="loading-container">
      <p>Chargement de l'exercice...</p>
    </div>

    <div v-else class="example-phrases">
      <h3 v-once>Taper le symbole suivant :</h3>
      <div class="lettre-and-symbols-container">
        <div class="lettre-and-symbols-item current">
          {{ currentSymbol.display }}
        </div>
        <div v-show="currentSymbol.hint" class="symbol-hint">
          {{ currentSymbol.hint }}
        </div>
        <ProgressBar 
          v-memo="[currentIndex]"
          :current-value="currentIndex + 1"
          :total-value="symbols.length"
        />
      </div>
    </div>

    <div class="textarea-container">
      <RestartModal v-model="isExerciseComplete">
        <template #header>
          <h2 v-once>Félicitations !</h2>
        </template>
        
        <div class="modal-buttons">
          <button 
            class="restart-button"
            @click="restartExercise"
          >
            <font-awesome-icon v-once icon="rotate-right" />
            <span v-once>Recommencer l'exercice</span>
          </button>
          <button class="next-button" @click="goNext">
            <font-awesome-icon v-once icon="arrow-right" />
            <span v-once>Passer à l'exercice suivant</span>
          </button>
        </div>
      </RestartModal>
      <Suspense>
        <template #default>
          <KeyboardTextArea
            v-memo="[currentSymbol, isCorrect, isIncorrect, validationMessage]"
            v-model="userInput"
            :is-complete="isExerciseComplete"
            :is-correct="isCorrect"
            :is-incorrect="isIncorrect"
            :message="validationMessage"
            :disabled="isLoading"
            placeholder="Tapez le symbole ici..."
            @input="debouncedCheck"
          />
        </template>
        <template #fallback>
          <div class="loading-container">
            <p>Chargement de la zone de saisie...</p>
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script>
import { useKeyboardExercise } from '@/composables/useKeyboardExercise'
import { onBeforeMount, onBeforeUnmount, getCurrentInstance, computed, ref, onMounted } from 'vue'
import { defineAsyncComponent } from 'vue'
import GlobalKeyboard from '@/components/keyboard/GlobalKeyboard.vue'
import KeyboardTextArea from '@/components/keyboard/KeyboardTextArea.vue'
import { useRouter } from 'vue-router'
import { useExerciseCache } from '@/composables/useExerciseCache'

const createAsyncComponent = (loader, options = {}) => defineAsyncComponent({
  loader,
  loadingComponent: null,
  delay: 200,
  timeout: 3000,
  errorComponent: null,
  onError(error, retry, fail, attempts) {
    if (attempts <= 3) {
      retry()
    } else {
      console.error('Failed to load component:', error)
      fail()
    }
  },
  suspensible: true,
  ...options
})

const RestartModal = createAsyncComponent(() => import('@/components/RestartModal.vue'))
const ProgressBar = createAsyncComponent(() => import('@/components/ProgressBar.vue'))

export default {
  name: 'KeyboardSymbolesView',
  
  components: {
    GlobalKeyboard,
    ProgressBar,
    RestartModal,
    KeyboardTextArea
  },

  setup() {
    const router = useRouter()
    const { proxy: app } = getCurrentInstance()
    const exerciseCache = useExerciseCache()
    const isLoading = ref(true)
    const error = ref(null)
    
    const {
      userInput,
      currentIndex,
      items: symbols,
      currentItem,
      isLastItem,
      typingSpeed,
      animationClasses,
      highlightedKeysCache,
      isCorrect,
      isIncorrect,
      isExerciseComplete,
      validationMessage,
      debounce,
      checkInput,
      resetExercise,
      cleanup: cleanupExercise
    } = useKeyboardExercise()

    // Initialisation sécurisée des symboles
    const initializeExercise = async () => {
      try {
        isLoading.value = true
        error.value = null
        const items = await exerciseCache.getItems('symboles', 20)
        
        if (!items || items.length === 0) {
          throw new Error("Impossible de charger les symboles pour l'exercice")
        }
        
        // Précharger le prochain lot
        exerciseCache.preloadNextExercises('symboles', currentIndex.value)
        
        symbols.value = items
        isLoading.value = false
      } catch (err) {
        console.error('Erreur lors du chargement des symboles:', err)
        error.value = err.message
        isLoading.value = false
      }
    }

    // Chargement initial
    onMounted(() => {
      initializeExercise()
    })

    const currentSymbol = computed(() => {
      return currentItem.value || { char: '', display: '', modifiers: [], hint: '' }
    })

    const currentCharToType = computed(() => {
      const symbol = currentSymbol.value
      if (!symbol?.char) return ''
      return symbol.char
    })

    const highlightedKeys = computed(() => {
      const symbol = currentSymbol.value
      if (!symbol?.char) return []
      
      const cacheKey = `${symbol.char}-${symbol.modifiers?.join(',') || ''}`
      const cached = highlightedKeysCache.getFromCache(cacheKey)
      if (cached) return cached
      
      const keys = [symbol.char, ...(symbol.modifiers || [])]
      highlightedKeysCache.addToCache(cacheKey, keys)
      return keys
    })
    
    // Load icons
    onBeforeMount(async () => {
      try {
        await Promise.all([
          app.$loadIcon('rotateRight'),
          app.$loadIcon('arrowRight')
        ])
      } catch (error) {
        console.warn('Erreur lors du chargement des icônes:', error)
      }
    })

    const checkSymbol = () => {
      const input = userInput.value.charAt(0)
      checkInput(input, currentCharToType.value, {
        isLastItem: isLastItem.value,
        successMessage: 'Correct !',
        completeMessage: 'Exercice terminé !',
        nextMessage: 'Appuyez sur Entrée pour continuer',
        isEnterPressed: true
      })
    }

    const restartExerciseHandler = async () => {
      try {
        isLoading.value = true
        error.value = null
        const newItems = await exerciseCache.refreshCache('symboles', 20)
        
        if (!newItems || newItems.length === 0) {
          throw new Error("Impossible de recharger les symboles pour l'exercice")
        }
        
        resetExercise(newItems)
        isLoading.value = false
      } catch (err) {
        console.error('Erreur lors du redémarrage:', err)
        error.value = "Une erreur est survenue lors du redémarrage de l'exercice"
        isLoading.value = false
      }
    }

    const goNext = () => {
      router.push({ name: 'keyboard-mots' })
    }

    const debouncedCheck = debounce((event) => {
      userInput.value = event.target.value
      checkSymbol()
    }, 100)

    onBeforeUnmount(() => {
      cleanupExercise()
      exerciseCache.cleanup()
    })

    return {
      // State
      userInput,
      currentIndex,
      symbols,
      isLoading,
      error,
      
      // Computed
      currentSymbol,
      currentCharToType,
      highlightedKeys,
      
      // Validation state
      isCorrect,
      isIncorrect,
      isExerciseComplete,
      validationMessage,
      
      // Methods
      debouncedCheck,
      restartExercise: restartExerciseHandler,
      goNext,
      cleanupExercise,
      initializeExercise,
      
      // Animation
      animationClasses,
      
      // Store
      typingSpeed
    }
  }
}
</script>

<style scoped>
@import '@/assets/styles/keyboard-exercises.css';
@import '@/assets/styles/optimized-animations.css';

/* Optimisations supplémentaires */
.keyboard-test {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
</style>
