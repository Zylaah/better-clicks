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
        <h3 v-once>Taper le symbole suivant :</h3>
        <div class="lettre-and-symbols-container">
          <div class="lettre-and-symbols-item current">
            {{ currentSymbol.display }}
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

        <textarea 
          v-show="!isExerciseComplete"
          v-model="userInput"
          class="modern-textarea"
          :class="{ 'correct': isCorrect, 'incorrect': isIncorrect }"
          placeholder="Tapez le symbole ici..."
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
import { useOptimizedAnimations } from '@/composables/useOptimizedAnimations'
import { useDebounce } from '@/composables/useDebounce'
import ProgressBar from '@/components/ProgressBar.vue'
import RestartModal from '@/components/RestartModal.vue'
import GlobalKeyboard from '@/components/keyboard/GlobalKeyboard.vue'

// Cache pour les symboles
const symbolCache = {
  allSymbols: null,
  getSymbols() {
    if (!this.allSymbols) {
      this.allSymbols = [
        { char: 'é', display: 'é', modifiers: [] },
        { char: 'è', display: 'è', modifiers: [] },
        { char: 'à', display: 'à', modifiers: [] },
        { char: 'ù', display: 'ù', modifiers: [] },
        { char: 'ç', display: 'ç', modifiers: [] },
        { char: '&', display: '&', modifiers: [] },
        { char: '"', display: '"', modifiers: [] },
        { char: "'", display: "'", modifiers: [] },
        { char: '(', display: '(', modifiers: [] },
        { char: ')', display: ')', modifiers: [] },
        { char: '-', display: '-', modifiers: [] },
        { char: '_', display: '_', modifiers: [] },
        { char: '^', display: '^', modifiers: [] },
        { char: '$', display: '$', modifiers: [] },
        { char: '*', display: '*', modifiers: [] },
        { char: ',', display: ',', modifiers: [] },
        { char: ';', display: ';', modifiers: [] },
        { char: ':', display: ':', modifiers: [] },
        { char: '!', display: '!', modifiers: [] },
        { char: '²', display: '²', modifiers: [] },
        { char: '~', display: '~', modifiers: ['AltRight'], keyCode: 'Digit2' },
        { char: '#', display: '#', modifiers: ['AltRight'], keyCode: 'Digit3' },
        { char: '{', display: '{', modifiers: ['AltRight'], keyCode: 'Digit4' },
        { char: '[', display: '[', modifiers: ['AltRight'], keyCode: 'Digit5' },
        { char: '|', display: '|', modifiers: ['AltRight'], keyCode: 'Digit6' },
        { char: '`', display: '`', modifiers: ['AltRight'], keyCode: 'Digit7' },
        { char: '\\', display: '\\', modifiers: ['AltRight'], keyCode: 'Digit8' },
        { char: '@', display: '@', modifiers: ['AltRight'], keyCode: 'Digit0' },
        { char: ']', display: ']', modifiers: ['AltRight'], keyCode: 'Minus' },
        { char: '}', display: '}', modifiers: ['AltRight'], keyCode: 'Equal' }
      ]
    }
    return this.shuffleArray([...this.allSymbols])
  },
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }
}

export default {
  name: 'KeyboardSymbolesView',
  
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

    return {
      store,
      typingSpeed,
      animationClasses,
      animateIfPossible,
      debouncedCheck: debounce((vm, input) => vm.checkSymbol(input), 100),
      clearDebounces
    }
  },

  data() {
    return {
      userInput: '',
      currentIndex: 0,
      isCorrect: false,
      isIncorrect: false,
      validationMessage: '',
      symbols: symbolCache.getSymbols(),
      isExerciseComplete: false,
      modifierKeys: [],
      cachedHighlightedKeys: {
        char: null,
        modifiers: null,
        keys: []
      },
      enterKeyListener: null
    }
  },

  computed: {
    currentSymbol() {
      return this.symbols[this.currentIndex] || { char: '', display: '', modifiers: [] }
    },

    highlightedKeys() {
      const symbol = this.currentSymbol
      if (!symbol?.char) return []
      
      if (this.cachedHighlightedKeys.char === symbol.char && 
          this.cachedHighlightedKeys.modifiers === symbol.modifiers) {
        return this.cachedHighlightedKeys.keys
      }
      
      return this.store.updateHighlightedKeysCache(symbol.char, symbol.modifiers)
    }
  },

  methods: {
    generateSymbolsList() {
      return symbolCache.getSymbols()
    },

    checkSymbol() {
      if (!this.userInput) {
        this.isCorrect = false
        this.isIncorrect = false
        this.validationMessage = ''
        return
      }

      const input = this.userInput.charAt(0)
      const currentSymbol = this.currentSymbol
      
      if (!currentSymbol || !currentSymbol.char) {
        return
      }
      
      if (input === currentSymbol.char) {
        this.isCorrect = true
        this.isIncorrect = false
        
        if (this.currentIndex === this.symbols.length - 1) {
          this.isExerciseComplete = true
          this.validationMessage = 'Parfait ! Vous avez terminé tous les symboles !'
        } else {
          this.validationMessage = 'Parfait ! Appuyez sur Entrée pour passer au symbole suivant.'
          this.addEnterKeyListener()
        }
      } else if (input) {
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
          if (this.currentIndex < this.symbols.length - 1) {
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
      this.symbols = this.generateSymbolsList()
      this.currentIndex = 0
      this.isExerciseComplete = false
      this.isCorrect = false
      this.isIncorrect = false
      this.userInput = ''
      this.validationMessage = ''
      this.store.reset()
    },

    goNext() {
      this.$router.push({ name: 'keyboard-mots' })
    },

    updateHighlightedKeysCache(char, modifiers) {
      this.cachedHighlightedKeys = {
        char,
        modifiers,
        keys: [char, ...(modifiers || [])]
      }
      return this.cachedHighlightedKeys.keys
    }
  },

  beforeUnmount() {
    if (this.enterKeyListener) {
      document.removeEventListener('keydown', this.enterKeyListener)
    }
    this.clearDebounces()
    this.store.reset()
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
