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
            v-if="phrases.length > 0"
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
              <span v-once>Retourner au menu</span>
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
          @enter="handleEnterPress"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useKeyboardExercise } from '@/composables/useKeyboardExercise'
import { onBeforeMount, computed, ref } from 'vue'
import { defineAsyncComponent } from 'vue'
import GlobalKeyboard from '@/components/keyboard/GlobalKeyboard.vue'
import KeyboardTextArea from '@/components/keyboard/KeyboardTextArea.vue'
import { useRouter } from 'vue-router'
import { useExerciseCache } from '@/composables/useExerciseCache'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faRotateRight, faArrowRight } from '@fortawesome/free-solid-svg-icons'

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
  name: 'KeyboardPhraseView',
  
  components: {
    GlobalKeyboard,
    KeyboardTextArea,
    RestartModal: createAsyncComponent(() => import('@/components/RestartModal.vue')),
    ProgressBar: createAsyncComponent(() => import('@/components/ProgressBar.vue'))
  },

  setup() {
    const router = useRouter()
    const exerciseCache = useExerciseCache()
    const phrases = ref([])

    const {
      userInput,
      currentIndex,
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
      cleanup: cleanupExercise,
      progress,
      stats,
      currentState
    } = useKeyboardExercise({
      exerciseType: 'phrases'
    })
    
    onBeforeMount(async () => {
      // Vérifier s'il y a un état sauvegardé
      if (currentState.value) {
        phrases.value = currentState.value.items
        currentIndex.value = currentState.value.currentIndex
      } else {
        // Sinon, initialiser avec de nouvelles phrases
        phrases.value = await exerciseCache.getItems('phrases', 10)
      }
      resetExercise(phrases.value)
    })

    const currentPhrase = computed(() => {
      return currentItem.value?.text || ''
    })

    const checkPhrase = async () => {
      const result = await checkInput(userInput.value, currentPhrase.value, {
        isLastItem: isLastItem.value,
        successMessage: 'Correct !',
        completeMessage: 'Félicitations ! Vous avez terminé cet exercice.',
        nextMessage: 'Appuyez sur Entrée pour passer à la phrase suivante'
      })

      if (result) {
        if (result.isCorrect && isLastItem.value && userInput.value === currentPhrase.value) {
          isExerciseComplete.value = true
          validationMessage.value = result.message
        } else if (result.isCorrect && !isLastItem.value) {
          validationMessage.value = 'Appuyez sur Entrée pour continuer'
        } else if (result.isIncorrect) {
          validationMessage.value = result.message
        }
      }
    }

    const handleEnterPress = () => {
      if (isCorrect.value && !isExerciseComplete.value) {
        if (currentIndex.value < phrases.value.length - 1) {
          currentIndex.value++
          userInput.value = ''
          validationMessage.value = ''
          isCorrect.value = false
          isIncorrect.value = false
        }
      }
    }

    const restartExerciseHandler = async () => {
      const newPhrases = await exerciseCache.refreshCache('phrases', 10)
      phrases.value = newPhrases
      await resetExercise(newPhrases)
      userInput.value = ''
      validationMessage.value = ''
      isCorrect.value = false
      isIncorrect.value = false
    }

    const goNext = () => {
      router.push({ name: 'keyboard-menu' })
    }

    const debouncedCheck = debounce((event) => {
      userInput.value = event.target.value
      checkPhrase()
    }, 100)

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
      
      // Progress data
      progress,
      stats,
      
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
