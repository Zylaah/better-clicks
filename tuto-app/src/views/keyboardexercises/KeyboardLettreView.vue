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
            v-if="letters.length > 0"
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
          @enter="handleEnterPress"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useKeyboardExercise } from '@/composables/useKeyboardExercise'
import { onBeforeMount, onBeforeUnmount, computed, ref, watch } from 'vue'
import { defineAsyncComponent } from 'vue'
import GlobalKeyboard from '@/components/keyboard/GlobalKeyboard.vue'
import KeyboardTextArea from '@/components/keyboard/KeyboardTextArea.vue'
import { useRouter } from 'vue-router'
import { useExerciseCache } from '@/composables/useExerciseCache'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faRotateRight, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useKeyboardEvents } from '@/composables/useKeyboardEvents'

library.add(faRotateRight, faArrowRight)

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

export default {
  name: 'KeyboardLettreView',
  
  components: {
    GlobalKeyboard,
    KeyboardTextArea,
    RestartModal: createAsyncComponent(() => import('@/components/RestartModal.vue')),
    ProgressBar: createAsyncComponent(() => import('@/components/ProgressBar.vue'))
  },

  setup() {
    const router = useRouter()
    const exerciseCache = useExerciseCache()
    const letters = ref([])
    const highlightedKeysRef = ref([])
    const keyboardEvents = useKeyboardEvents()

    const {
      userInput,
      currentIndex,
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
      return highlightedKeysRef.value
    })
    
    // Mettre à jour les touches surlignées quand la lettre courante change
    watch(() => currentLetter.value, async (letter) => {
      if (!letter?.char) {
        highlightedKeysRef.value = []
        return
      }
      
      const cacheKey = `${letter.char}-${letter.modifiers?.join(',') || ''}`
      const cached = await highlightedKeysCache.getFromCache(cacheKey)
      
      if (cached) {
        highlightedKeysRef.value = cached
      } else {
        const keys = [letter.char, ...(letter.modifiers || [])]
        highlightedKeysRef.value = keys
        highlightedKeysCache.addToCache(cacheKey, keys)
      }
    }, { immediate: true })
    
    onBeforeMount(async () => {
      // Initialize letters
      letters.value = await exerciseCache.getItems('lettres')
      resetExercise(letters.value)
    })

    const checkLetter = async () => {
      const input = userInput.value.charAt(0)
      const result = await checkInput(input, currentCharToType.value, {
        isLastItem: isLastItem.value,
        successMessage: 'Correct !',
        completeMessage: 'Félicitations ! Vous avez terminé cet exercice.',
        nextMessage: 'Appuyez sur Entrée pour passer à la lettre suivante'
      })

      if (result) {
        if (result.isCorrect && isLastItem.value && input === currentCharToType.value) {
          isExerciseComplete.value = true
          validationMessage.value = result.message
        } else if (result.isCorrect && !isLastItem.value) {
          validationMessage.value = 'Appuyez sur Entrée pour continuer'
        } else if (result.isIncorrect) {
          validationMessage.value = result.message
        }
      }
    }

    const restartExerciseHandler = async () => {
      keyboardEvents.removeEnterKeyListener()
      const newLetters = await exerciseCache.refreshCache('lettres')
      resetExercise(newLetters)
      userInput.value = ''
      validationMessage.value = ''
    }

    const goNext = () => {
      keyboardEvents.removeEnterKeyListener()
      router.push({ name: 'keyboard-symboles' })
    }

    const debouncedCheck = debounce((event) => {
      userInput.value = event.target.value
      checkLetter()
    }, 100)

    const handleEnterPress = () => {
      if (isCorrect.value && !isExerciseComplete.value) {
        if (currentIndex.value < letters.value.length - 1) {
          currentIndex.value++
          userInput.value = ''
          validationMessage.value = ''
          isCorrect.value = false
          isIncorrect.value = false
        }
      }
    }

    onBeforeUnmount(() => {
      keyboardEvents.removeEnterKeyListener()
      cleanupExercise()
      exerciseCache.cleanup()
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
      handleEnterPress,
      
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
