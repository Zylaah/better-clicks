<template>
  <div class="keyboard-test" :class="animationClasses">
    <GlobalKeyboard
      v-memo="[currentPhrase]"
      :show-debug-controls="true"
      :show-event-log="true"
      :max-log-entries="10"
    />

    <div v-if="isLoading" class="loading-container">
      <p>Chargement de l'exercice...</p>
    </div>

    <div v-else class="example-phrases">
      <h3 v-once>Phrase à recopier :</h3>
      <div class="phrases-container">
        <div class="phrase-item current">
          {{ currentPhrase }}
        </div>
        <ProgressBar 
          v-memo="[currentIndex]"
          :current-value="currentIndex + 1"
          :total-value="phrases.length"
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
            <span v-once>Retour au menu</span>
          </button>
        </div>
      </RestartModal>

      <KeyboardTextArea
        v-memo="[currentPhrase, isCorrect, isIncorrect, validationMessage]"
        v-model="userInput"
        :is-complete="isExerciseComplete"
        :is-correct="isCorrect"
        :is-incorrect="isIncorrect"
        :message="validationMessage"
        :disabled="isLoading"
        placeholder="Recopiez la phrase ici..."
        @input="debouncedCheck"
      />
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
  name: 'KeyboardPhraseView',
  
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
      items: phrases,
      currentItem,
      isLastItem,
      typingSpeed,
      animationClasses,
      isCorrect,
      isIncorrect,
      isExerciseComplete,
      validationMessage,
      debounce,
      checkInput,
      resetExercise,
      cleanup: cleanupExercise
    } = useKeyboardExercise()

    // Initialisation sécurisée des phrases
    const initializeExercise = async () => {
      try {
        isLoading.value = true
        error.value = null
        const items = await exerciseCache.getItems('phrases', 10)
        
        if (!items || items.length === 0) {
          throw new Error("Impossible de charger les phrases pour l'exercice")
        }
        
        phrases.value = items
        isLoading.value = false
      } catch (err) {
        console.error('Erreur lors du chargement des phrases:', err)
        error.value = "Une erreur est survenue lors du chargement de l'exercice"
        isLoading.value = false
      }
    }

    // Chargement initial
    onMounted(() => {
      initializeExercise()
    })

    const currentPhrase = computed(() => {
      return currentItem.value?.text || ''
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

    const checkPhrase = () => {
      checkInput(userInput.value, currentPhrase.value, {
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
        const newItems = await exerciseCache.refreshCache('phrases', 10)
        
        if (!newItems || newItems.length === 0) {
          throw new Error("Impossible de recharger les phrases pour l'exercice")
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
      router.push({ name: 'keyboard-menu' })
    }

    const debouncedCheck = debounce((event) => {
      userInput.value = event.target.value
      checkPhrase()
    }, 100)

    onBeforeUnmount(() => {
      cleanupExercise()
      exerciseCache.cleanup()
    })

    return {
      // State
      userInput,
      currentIndex,
      phrases,
      isLoading,
      error,
      
      // Computed
      currentPhrase,
      
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
</style>
