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
          @input="debouncedCheck(this, $event.target.value)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useKeyboardStore } from '@/stores/keyboard'
import { storeToRefs } from 'pinia'
import { useOptimizedAnimations } from '@/composables/useOptimizedAnimations'
import { useDebounce } from '@/composables/useDebounce'
import { useCacheManager } from '@/composables/useCacheManager'
import { useValidation } from '@/composables/useValidation'
import { useKeyboardEvents } from '@/composables/useKeyboardEvents'
import ProgressBar from '@/components/ProgressBar.vue'
import RestartModal from '@/components/RestartModal.vue'
import GlobalKeyboard from '@/components/keyboard/GlobalKeyboard.vue'
import KeyboardTextArea from '@/components/keyboard/KeyboardTextArea.vue'

// Cache pour les symboles avec gestionnaire de cache
const symbolCache = {
  cacheManager: useCacheManager(50),
  getSymbols() {
    const cached = this.cacheManager.getFromCache('symbols')
    if (cached) return [...cached]

    const symbols = [
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
    
    this.cacheManager.addToCache('symbols', symbols)
    return this.shuffleArray([...symbols])
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
    RestartModal,
    KeyboardTextArea
  },

  setup() {
    const store = useKeyboardStore()
    const { typingSpeed } = storeToRefs(store)
    const { animationClasses, animateIfPossible } = useOptimizedAnimations()
    const { debounce, clearDebounces } = useDebounce()
    const highlightedKeysCache = useCacheManager(20)
    const validation = useValidation({ maxCacheSize: 30 })
    const keyboardEvents = useKeyboardEvents()

    return {
      store,
      typingSpeed,
      animationClasses,
      animateIfPossible,
      debouncedCheck: debounce((vm, input) => vm.checkSymbol(input), 100),
      clearDebounces,
      highlightedKeysCache,
      keyboardEvents,
      ...validation
    }
  },

  data() {
    return {
      userInput: '',
      currentIndex: 0,
      symbols: symbolCache.getSymbols(),
      modifierKeys: [],
      cachedHighlightedKeys: {
        char: null,
        modifiers: null,
        keys: []
      }
    }
  },

  computed: {
    currentSymbol() {
      return this.symbols[this.currentIndex] || { char: '', display: '', modifiers: [] }
    },

    isLastSymbol() {
      return this.currentIndex === this.symbols.length - 1
    },

    currentCharToType() {
      const symbol = this.currentSymbol
      if (!symbol?.char) return ''
      return symbol.char
    },

    shouldUpdateHighlightedKeys() {
      const symbol = this.currentSymbol
      return this.cachedHighlightedKeys.char !== symbol.char || 
             this.cachedHighlightedKeys.modifiers !== symbol.modifiers
    },

    highlightedKeys() {
      const symbol = this.currentSymbol
      if (!symbol?.char) return []
      
      const cacheKey = `${symbol.char}-${symbol.modifiers?.join(',') || ''}`
      const cached = this.highlightedKeysCache.getFromCache(cacheKey)
      if (cached) return cached
      
      const keys = this.store.updateHighlightedKeysCache(symbol.char, symbol.modifiers)
      this.highlightedKeysCache.addToCache(cacheKey, keys)
      return keys
    },

    isValidInput() {
      return this.userInput.length > 0
    },

    currentInput() {
      return this.userInput.charAt(0)
    }
  },

  methods: {
    generateSymbolsList() {
      return symbolCache.getSymbols()
    },

    checkSymbol() {
      if (!this.isValidInput) {
        this.resetValidation()
        return
      }

      const result = this.validateInput(this.currentInput, this.currentCharToType, {
        isLastItem: this.isLastSymbol,
        successMessage: 'Parfait !',
        completeMessage: 'Parfait ! Vous avez terminé tous les symboles !',
        nextMessage: 'Appuyez sur Entrée pour passer au symbole suivant.'
      })

      if (result.isCorrect && !result.isComplete) {
        this.keyboardEvents.addEnterKeyListener(() => {
          if (this.currentIndex < this.symbols.length - 1) {
            this.currentIndex++
            this.isCorrect = false
            this.validationMessage = ''
            this.userInput = ''
          }
        })
      }
    },

    restartExercise() {
      this.symbols = this.generateSymbolsList()
      this.currentIndex = 0
      this.userInput = ''
      this.resetValidation()
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
    this.clearDebounces()
    this.store.reset()
    this.highlightedKeysCache.clearCache()
    symbolCache.cacheManager.cleanOldEntries()
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
