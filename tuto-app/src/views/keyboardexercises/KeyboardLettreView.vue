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
          @input="debouncedCheck(this, $event.target.value)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useKeyboardStore } from '@/stores/keyboard'
import { storeToRefs } from 'pinia'
import { LetterGenerator } from '@/services/letterGenerator'
import { useOptimizedAnimations } from '@/composables/useOptimizedAnimations'
import { useDebounce } from '@/composables/useDebounce'
import { useCacheManager } from '@/composables/useCacheManager'
import { useValidation } from '@/composables/useValidation'
import { useKeyboardEvents } from '@/composables/useKeyboardEvents'
import ProgressBar from '@/components/ProgressBar.vue'
import RestartModal from '@/components/RestartModal.vue'
import GlobalKeyboard from '@/components/keyboard/GlobalKeyboard.vue'
import KeyboardTextArea from '@/components/keyboard/KeyboardTextArea.vue'
import { useRouter } from 'vue-router'

// Cache pour les lettres générées avec gestionnaire de cache
const letterCache = {
  cacheManager: useCacheManager(50),
  getCachedLetters() {
    const cached = this.cacheManager.getFromCache('letters')
    if (cached) return [...cached]
    
    const letters = LetterGenerator.generateRandomLetters()
    this.cacheManager.addToCache('letters', letters)
    return [...letters]
  },
  refreshCache() {
    const letters = LetterGenerator.generateRandomLetters()
    this.cacheManager.addToCache('letters', letters)
    return [...letters]
  }
}

export default {
  name: 'KeyboardLettreView',
  
  components: {
    GlobalKeyboard,
    ProgressBar,
    RestartModal,
    KeyboardTextArea
  },

  setup() {
    const store = useKeyboardStore()
    const { typingSpeed } = storeToRefs(store)
    const { animationClasses } = useOptimizedAnimations()
    const { debounce, clearDebounces } = useDebounce()
    const validation = useValidation({ maxCacheSize: 50 })
    const keyboardEvents = useKeyboardEvents()
    const router = useRouter()
    const highlightedKeysCache = useCacheManager(50)
  

    return {
      store,
      typingSpeed,
      animationClasses,
      debouncedCheck: debounce((event) => {
        if (event && event.target) {
          validation.validateInput(event.target.value)
        }
      }, 100),
      clearDebounces,
      keyboardEvents,
      router,
      highlightedKeysCache,
      ...validation
    }
  },

  data() {
    return {
      userInput: '',
      currentIndex: 0,
      letters: letterCache.getCachedLetters(),
      cachedHighlightedKeys: {
        char: null,
        modifiers: null,
        keys: []
      }
    }
  },

  computed: {
    currentLetter() {
      return this.letters[this.currentIndex] || { char: '', display: '', modifiers: [] }
    },

    shouldShowCaseInfo() {
      return isNaN(this.currentLetter.display)
    },

    caseInfoText() {
      if (!this.shouldShowCaseInfo) return ''
      return this.currentLetter.display === this.currentLetter.display.toUpperCase() ? 'Majuscule' : 'Minuscule'
    },

    isValidInput() {
      return this.userInput.length > 0
    },

    currentCharToType() {
      const letter = this.currentLetter
      if (!letter?.char) return ''
      return letter.char
    },

    shouldUpdateHighlightedKeys() {
      const letter = this.currentLetter
      return this.cachedHighlightedKeys.char !== letter.char || 
             this.cachedHighlightedKeys.modifiers !== letter.modifiers
    },

    highlightedKeys() {
      const letter = this.currentLetter
      if (!letter?.char) return []
      
      const cacheKey = `${letter.char}-${letter.modifiers?.join(',') || ''}`
      const cached = this.highlightedKeysCache.getFromCache(cacheKey)
      if (cached) return cached
      
      const keys = this.store.updateHighlightedKeysCache(letter.char, letter.modifiers)
      this.highlightedKeysCache.addToCache(cacheKey, keys)
      return keys
    }
  },

  methods: {
    checkLetter() {
      const input = this.userInput.charAt(0)
      const result = this.validateInput(input, this.currentCharToType, {
        isLastItem: this.currentIndex === this.letters.length - 1,
        successMessage: '',
        completeMessage: '',
        nextMessage: ''
      })

      if (result.isCorrect && !result.isComplete) {
        this.keyboardEvents.addEnterKeyListener(() => {
          if (this.currentIndex < this.letters.length - 1) {
            this.currentIndex++
            this.isCorrect = false
            this.validationMessage = ''
            this.userInput = ''
          }
        })
      }
    },

    restartExercise() {
      this.letters = letterCache.refreshCache()
      this.currentIndex = 0
      this.userInput = ''
      this.resetValidation()
      this.store.reset()
    },

    goNext() {
      this.router.push({ name: 'keyboard-symboles' })
    }
  },

  beforeUnmount() {
    this.clearDebounces()
    this.store.reset()
    this.highlightedKeysCache.clearCache()
    letterCache.cacheManager.cleanOldEntries()
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
