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
        <h3 v-once>Phrase à recopier :</h3>
        <div class="phrases-container">
          <div class="phrase-item current">
            {{ phrasesExemple[currentPhraseIndex] }}
          </div>
          <ProgressBar 
            v-memo="[currentPhraseIndex]"
            :current-value="currentPhraseIndex + 1"
            :total-value="phrasesExemple.length"
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
          v-model="textContent"
          class="modern-textarea"
          :class="{ 'correct': isCorrect, 'incorrect': isIncorrect }"
          placeholder="Recopiez la phrase ici..."
          rows="5"
          @input="debouncedCheck(this, $event.target.value)"
          @keydown.enter.prevent
        ></textarea>

        <div v-show="validationMessage" class="validation-message" :class="{ 'correct': isCorrect, 'incorrect': isIncorrect }">
          {{ validationMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useKeyboardStore } from '@/stores/keyboard'
import { storeToRefs } from 'pinia'
import phrases from '@/data/phrases.json'
import { useOptimizedAnimations } from '@/composables/useOptimizedAnimations'
import { useDebounce } from '@/composables/useDebounce'
import ProgressBar from '@/components/ProgressBar.vue'
import RestartModal from '@/components/RestartModal.vue'
import GlobalKeyboard from '@/components/keyboard/GlobalKeyboard.vue'

// Cache pour les phrases
const phraseCache = {
  allPhrases: [],
  getRandomPhrases(count) {
    if (this.allPhrases.length === 0) {
      this.allPhrases = [...phrases.phrases]
    }
    return this.shuffleArray([...this.allPhrases]).slice(0, count)
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
  name: 'KeyboardPhraseView',
  
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
      debouncedCheck: debounce((vm, input) => vm.checkPhrase(input), 100),
      clearDebounces
    }
  },

  data() {
    return {
      textContent: '',
      currentPhraseIndex: 0,
      isCorrect: false,
      isIncorrect: false,
      validationMessage: '',
      isExerciseComplete: false,
      phrasesExemple: phraseCache.getRandomPhrases(15),
      cachedHighlightedKeys: {
        char: null,
        modifiers: null,
        keys: []
      },
      enterKeyListener: null
    }
  },

  computed: {
    currentPhrase() {
      return this.phrasesExemple[this.currentPhraseIndex] || ''
    },

    isLastPhrase() {
      return this.currentPhraseIndex === this.phrasesExemple.length - 1
    },

    currentCharToType() {
      const phrase = this.currentPhrase
      if (!phrase) return ''
      return this.textContent.length < phrase.length ? phrase[this.textContent.length] : ''
    },

    shouldUpdateHighlightedKeys() {
      return this.cachedHighlightedKeys.char !== this.currentCharToType
    },

    highlightedKeys() {
      const currentChar = this.currentCharToType
      if (!currentChar) return []
      
      if (!this.shouldUpdateHighlightedKeys) {
        return this.cachedHighlightedKeys.keys
      }
      
      return this.store.updateHighlightedKeysCache(currentChar, [])
    },

    isPartiallyCorrect() {
      return this.currentPhrase.startsWith(this.textContent)
    },

    validationErrorMessage() {
      if (!this.textContent || this.isPartiallyCorrect) return ''
      return `Vous avez écrit : "${this.textContent}"
      Attendu : "${this.currentPhrase.slice(0, Math.max(this.textContent.length, 0))}"`
    }
  },

  methods: {
    getRandomPhrases(count) {
      return phraseCache.getRandomPhrases(count)
    },

    checkPhrase() {
      if (this.textContent === this.currentPhrase) {
        this.isCorrect = true
        this.isIncorrect = false
        
        if (this.isLastPhrase) {
          this.isExerciseComplete = true
          this.validationMessage = 'Parfait ! Vous avez terminé toutes les phrases !'
        } else {
          this.validationMessage = 'Parfait ! Appuyez sur Entrée pour passer à la phrase suivante.'
          this.addEnterKeyListener()
        }
      } else {
        this.isCorrect = false
        this.isIncorrect = !this.isPartiallyCorrect
        this.validationMessage = this.validationErrorMessage
      }
    },

    addEnterKeyListener() {
      if (this.enterKeyListener) {
        document.removeEventListener('keydown', this.enterKeyListener)
      }
      
      this.enterKeyListener = (event) => {
        if (event.key === 'Enter') {
          if (this.isCorrect && this.currentPhraseIndex < this.phrasesExemple.length - 1) {
            this.currentPhraseIndex++
            this.isCorrect = false
            this.validationMessage = ''
          }
          this.textContent = ''
          this.isIncorrect = false
          document.removeEventListener('keydown', this.enterKeyListener)
          this.enterKeyListener = null
        }
      }
      
      document.addEventListener('keydown', this.enterKeyListener, { passive: true })
    },

    restartExercise() {
      this.phrasesExemple = this.getRandomPhrases(15)
      this.currentPhraseIndex = 0
      this.isExerciseComplete = false
      this.isCorrect = false
      this.isIncorrect = false
      this.textContent = ''
      this.validationMessage = ''
      this.store.reset()
    },

    goNext() {
      this.$router.push({ name: 'keyboard-menu' })
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
