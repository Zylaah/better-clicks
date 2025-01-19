<template>
  <div class="keyboard-test" :class="animationClasses">
    <GlobalKeyboard
      :show-debug-controls="true"
      :show-event-log="true"
      :max-log-entries="10"
      :highlighted-keys="highlightedKeys"
    />

    <div v-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button class="retry-button" @click="initializeExercise">
        <font-awesome-icon icon="rotate-right" />
        <span>Réessayer</span>
      </button>
    </div>

    <div v-else class="example-phrase-container slide-up">
      <div v-if="isLoading" class="loading-container">
        <p>Chargement de l'exercice...</p>
      </div>

      <div v-else class="example-phrases">
        <h3 v-once>Taper la lettre suivante :</h3>
        <div class="lettre-and-symbols-container">
          <div class="lettre-and-symbols-item current">
            {{ currentLetter.display }}
          </div>
          <div v-show="shouldShowCaseInfo" class="case-info">
            {{ caseInfoText }}
          </div>
          <ProgressBar 
            v-memo="[currentIndex]"
            :current-value="currentIndex + 1"
            :total-value="letters.length"
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

        <KeyboardTextArea
          v-model="userInput"
          :is-complete="isExerciseComplete"
          :is-correct="isCorrect"
          :is-incorrect="isIncorrect"
          :message="validationMessage"
          :disabled="isLoading"
          placeholder="Tapez la lettre ici..."
          @input="debouncedCheck"
        />
      </div>
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
  suspensible: true, // Permet une meilleure gestion de la mémoire avec Suspense
  ...options
})

const RestartModal = createAsyncComponent(() => import('@/components/RestartModal.vue'))

const ProgressBar = createAsyncComponent(() => import('@/components/ProgressBar.vue'))

export default {
  name: 'KeyboardLettreView',
  
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
      items: letters,
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

    // Initialisation sécurisée des lettres
    const initializeExercise = async () => {
      try {
        isLoading.value = true
        error.value = null
        const items = await exerciseCache.getItems('lettres', 20)
        
        if (!items || items.length === 0) {
          throw new Error("Impossible de charger les lettres pour l'exercice")
        }
        
        letters.value = items
        isLoading.value = false
      } catch (err) {
        console.error('Erreur lors du chargement des lettres:', err)
        error.value = "Une erreur est survenue lors du chargement de l'exercice"
        isLoading.value = false
      }
    }

    // Chargement initial
    onMounted(() => {
      initializeExercise()
    })

    const currentLetter = computed(() => {
      return currentItem.value || { char: '', display: '', modifiers: [] }
    })

    const currentCharToType = computed(() => {
      const letter = currentLetter.value
      if (!letter?.char) return ''
      return letter.char
    })

    const shouldShowCaseInfo = computed(() => {
      return isNaN(currentLetter.value.display)
    })

    const caseInfoText = computed(() => {
      if (!shouldShowCaseInfo.value) return ''
      return currentLetter.value.display === currentLetter.value.display.toUpperCase() ? 'Majuscule' : 'Minuscule'
    })

    const highlightedKeys = computed(() => {
      const letter = currentLetter.value
      if (!letter?.char) return []
      
      const cacheKey = `${letter.char}-${letter.modifiers?.join(',') || ''}`
      const cached = highlightedKeysCache.getFromCache(cacheKey)
      if (cached) return cached
      
      const keys = [letter.char, ...(letter.modifiers || [])]
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

    const checkLetter = () => {
      const input = userInput.value.charAt(0)
      checkInput(input, currentCharToType.value, {
        isLastItem: isLastItem.value,
        successMessage: 'Correct !',
        completeMessage: 'Exercice terminé !',
        nextMessage: 'Appuyez sur Entrée pour continuer'
      })
    }

    const restartExerciseHandler = async () => {
      try {
        isLoading.value = true
        error.value = null
        const newItems = await exerciseCache.refreshCache('lettres', 20)
        
        if (!newItems || newItems.length === 0) {
          throw new Error("Impossible de recharger les lettres pour l'exercice")
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
      router.push({ name: 'keyboard-symboles' })
    }

    const debouncedCheck = debounce((event) => {
      userInput.value = event.target.value
      checkLetter()
    }, 100)

    onBeforeUnmount(() => {
      cleanupExercise()
      exerciseCache.cleanup()
    })

    return {
      // State
      userInput,
      currentIndex,
      letters,
      isLoading,
      error,
      
      // Computed
      currentLetter,
      currentCharToType,
      shouldShowCaseInfo,
      caseInfoText,
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

.typing-speed {
  will-change: transform, opacity;
}

.example-phrase-container {
  will-change: transform;
}

/* États de chargement et d'erreur */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
  padding: 2rem;
}

.error-message {
  color: var(--error-color);
  margin-bottom: 1rem;
}

.retry-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: var(--accent-color);
  color: var(--text-color);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background-color: var(--hover-color);
}

/* Styles spécifiques aux lettres */
.lettre-and-symbols-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.lettre-and-symbols-item {
  font-size: 2rem;
  font-weight: bold;
}

.case-info {
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>
