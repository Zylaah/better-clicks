<template>
  <div class="keyboard-test" :class="animationClasses">
    <GlobalKeyboard
      :show-debug-controls="true"
      :show-event-log="true"
      :max-log-entries="10"
      :highlighted-keys="highlightedKeys"
    />

    <div class="example-phrase-container slide-up">
      <div class="example-phrases">
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
          placeholder="Tapez la lettre ici..."
          @input="debouncedCheck"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useKeyboardExercise } from '@/composables/useKeyboardExercise'
import { LetterGenerator } from '@/services/letterGenerator'
import { useCacheManager } from '@/composables/useCacheManager'
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
    const cacheManager = useCacheManager(50)
    
    const letterCache = {
      getCachedLetters() {
        const cached = cacheManager.getFromCache('letters')
        if (cached) return [...cached]
        
        const letters = LetterGenerator.generateRandomLetters()
        cacheManager.addToCache('letters', letters)
        return [...letters]
      },
      refreshCache() {
        const letters = LetterGenerator.generateRandomLetters()
        cacheManager.addToCache('letters', letters)
        return [...letters]
      }
    }
    
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

    // Initialize letters
    letters.value = letterCache.getCachedLetters()

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
      await Promise.all([
        app.$loadIcon('rotateRight'),
        app.$loadIcon('arrowRight')
      ])
    })

    const checkLetter = () => {
      const input = userInput.value.charAt(0)
      checkInput(input, currentCharToType.value, {
        isLastItem: isLastItem.value,
        successMessage: '',
        completeMessage: '',
        nextMessage: ''
      })
    }

    const restartExerciseHandler = () => {
      resetExercise(letterCache.refreshCache())
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
      cacheManager.stopCleanupInterval()
      cacheManager.cleanOldEntries()
    })

    return {
      // State
      userInput,
      currentIndex,
      letters,
      
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
