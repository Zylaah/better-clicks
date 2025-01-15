<template>
  <div class="keyboard-test" :class="animationClasses">
    <GlobalKeyboard
      :show-debug-controls="true"
      :show-event-log="true"
      :max-log-entries="10"
      :highlighted-keys="highlightedKeys"
    />

    <div v-show="typingSpeed > 0" class="typing-speed fade-in">
      Vitesse de frappe : {{ typingSpeed }} frappes/minute
    </div>

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

        <textarea 
          v-show="!isExerciseComplete"
          v-model="userInput"
          class="modern-textarea"
          :class="{ 'correct': isCorrect, 'incorrect': isIncorrect }"
          placeholder="Tapez la lettre ici..."
          rows="5"
          @input="debouncedCheck(this, $event.target.value)"
          @keydown.enter.prevent
        ></textarea>

        <div v-show="validationMessage" class="validation-message">
          {{ validationMessage }}
        </div>
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
import ProgressBar from '@/components/ProgressBar.vue'
import RestartModal from '@/components/RestartModal.vue'
import GlobalKeyboard from '@/components/keyboard/GlobalKeyboard.vue'

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
    RestartModal
  },

  setup() {
    const store = useKeyboardStore()
    const { typingSpeed } = storeToRefs(store)
    const { animationClasses, animateIfPossible } = useOptimizedAnimations()
    const { debounce, clearDebounces } = useDebounce()
    const highlightedKeysCache = useCacheManager(20)

    return {
      store,
      typingSpeed,
      animationClasses,
      animateIfPossible,
      debouncedCheck: debounce((vm, input) => vm.checkLetter(input), 100),
      clearDebounces,
      highlightedKeysCache
    }
  },

  data() {
    return {
      userInput: '',
      currentIndex: 0,
      isCorrect: false,
      isIncorrect: false,
      validationMessage: '',
      letters: letterCache.getCachedLetters(),
      isExerciseComplete: false,
      cachedHighlightedKeys: {
        char: null,
        modifiers: null,
        keys: []
      },
      enterKeyListener: null
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
      
      if (input === this.currentCharToType) {
        this.isCorrect = true
        this.isIncorrect = false
        
        if (this.currentIndex === this.letters.length - 1) {
          this.isExerciseComplete = true
          this.validationMessage = 'Parfait ! Vous avez terminé toutes les lettres !'
        } else {
          this.validationMessage = 'Parfait ! Appuyez sur Entrée pour passer à la lettre suivante.'
          this.addEnterKeyListener()
        }
      } else if (this.isValidInput) {
        this.isCorrect = false
        this.isIncorrect = true
        this.validationMessage = ''
      } else {
        this.isCorrect = false
        this.isIncorrect = false
        this.validationMessage = ''
      }
    },

    addEnterKeyListener() {
      if (this.enterKeyListener) {
        document.removeEventListener('keydown', this.enterKeyListener)
      }
      
      this.enterKeyListener = (event) => {
        if (event.key === 'Enter' && this.isCorrect) {
          if (this.currentIndex < this.letters.length - 1) {
            this.currentIndex++
            this.isCorrect = false
            this.validationMessage = ''
            this.userInput = ''
          }
          document.removeEventListener('keydown', this.enterKeyListener)
          this.enterKeyListener = null
        }
      }
      
      document.addEventListener('keydown', this.enterKeyListener, { passive: true })
    },

    restartExercise() {
      this.letters = letterCache.refreshCache()
      this.currentIndex = 0
      this.isExerciseComplete = false
      this.isCorrect = false
      this.isIncorrect = false
      this.userInput = ''
      this.validationMessage = ''
      this.store.reset()
    },

    goNext() {
      this.$router.push({ name: 'keyboard-symboles' })
    }
  },

  beforeUnmount() {
    if (this.enterKeyListener) {
      document.removeEventListener('keydown', this.enterKeyListener)
    }
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
