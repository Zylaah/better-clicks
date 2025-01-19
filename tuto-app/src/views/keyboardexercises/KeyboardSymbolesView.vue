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
        <h3 v-once>Taper le symbole suivant :</h3>
        <div class="lettre-and-symbols-container">
          <div class="lettre-and-symbols-item current">
            {{ currentSymbol.display }}
          </div>
          <ProgressBar 
            v-if="symbols.length > 0"
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

        <KeyboardTextArea
          v-model="userInput"
          :is-complete="isExerciseComplete"
          :is-correct="isCorrect"
          :is-incorrect="isIncorrect"
          :message="validationMessage"
          placeholder="Tapez le symbole ici..."
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
  name: 'KeyboardSymbolesView',
  
  components: {
    GlobalKeyboard,
    KeyboardTextArea,
    RestartModal: createAsyncComponent(() => import('@/components/RestartModal.vue')),
    ProgressBar: createAsyncComponent(() => import('@/components/ProgressBar.vue'))
  },

  setup() {
    const router = useRouter()
    const exerciseCache = useExerciseCache()
    const symbols = ref([])
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

    const currentSymbol = computed(() => {
      return currentItem.value || { char: '', display: '', modifiers: [] }
    })

    const currentCharToType = computed(() => {
      const symbol = currentSymbol.value
      if (!symbol?.char) return ''
      return symbol.char
    })

    const highlightedKeys = computed(() => {
      return highlightedKeysRef.value
    })
    
    // Mettre à jour les touches surlignées quand le symbole courant change
    watch(() => currentSymbol.value, async (symbol) => {
      if (!symbol?.char) {
        highlightedKeysRef.value = []
        return
      }
      
      const cacheKey = `${symbol.char}-${symbol.modifiers?.join(',') || ''}`
      const cached = await highlightedKeysCache.getFromCache(cacheKey)
      
      if (cached) {
        highlightedKeysRef.value = cached
      } else {
        const keys = [symbol.char, ...(symbol.modifiers || [])]
        highlightedKeysRef.value = keys
        highlightedKeysCache.addToCache(cacheKey, keys)
      }
    }, { immediate: true })
    
    onBeforeMount(async () => {
      // Initialize symbols
      symbols.value = await exerciseCache.getItems('symboles')
      resetExercise(symbols.value)
    })

    const checkSymbol = async () => {
      const input = userInput.value.charAt(0)
      const result = await checkInput(input, currentCharToType.value, {
        isLastItem: isLastItem.value,
        successMessage: 'Correct !',
        completeMessage: 'Félicitations ! Vous avez terminé cet exercice.',
        nextMessage: 'Appuyez sur Entrée pour passer au symbole suivant'
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
      const newSymbols = await exerciseCache.refreshCache('symboles')
      symbols.value = newSymbols
      resetExercise(newSymbols)
      userInput.value = ''
      validationMessage.value = ''
      isCorrect.value = false
      isIncorrect.value = false
    }

    const goNext = () => {
      keyboardEvents.removeEnterKeyListener()
      router.push({ name: 'keyboard-mots' })
    }

    const debouncedCheck = debounce((event) => {
      userInput.value = event.target.value
      checkSymbol()
    }, 100)

    const handleEnterPress = () => {
      if (isCorrect.value && !isExerciseComplete.value) {
        if (currentIndex.value < symbols.value.length - 1) {
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
      symbols,
      
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
