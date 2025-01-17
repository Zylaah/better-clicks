<template>
  <div class="keyboard-test" :class="animationClasses">
    <GlobalKeyboard
      :show-debug-controls="true"
      :show-event-log="true"
      :max-log-entries="10"
    />

    <div class="example-phrase-container slide-up">
      <div class="example-phrases">
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
          placeholder="Recopiez la phrase ici..."
          @input="debouncedCheck"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useKeyboardExercise } from '@/composables/useKeyboardExercise'
import { PhraseGenerator } from '@/services/phraseGenerator'
import { onBeforeMount, onBeforeUnmount, getCurrentInstance, computed } from 'vue'
import { defineAsyncComponent } from 'vue'
import GlobalKeyboard from '@/components/keyboard/GlobalKeyboard.vue'
import KeyboardTextArea from '@/components/keyboard/KeyboardTextArea.vue'
import { useRouter } from 'vue-router'

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

    // Initialize phrases with medium difficulty
    const currentDifficulty = 'MEDIUM'
    phrases.value = PhraseGenerator.generateRandomPhrases(15, currentDifficulty)

    const currentPhrase = computed(() => {
      return currentItem.value?.text || ''
    })
    
    // Load icons
    onBeforeMount(async () => {
      await Promise.all([
        app.$loadIcon('rotateRight'),
        app.$loadIcon('arrowRight')
      ])
    })

    const checkPhrase = () => {
      checkInput(userInput.value, currentPhrase.value, {
        isLastItem: isLastItem.value,
        successMessage: '',
        completeMessage: '',
        nextMessage: ''
      })
    }

    const restartExerciseHandler = () => {
      resetExercise(PhraseGenerator.generateRandomPhrases(15, currentDifficulty))
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
    })

    return {
      // State
      userInput,
      currentIndex,
      phrases,
      
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
</style>
