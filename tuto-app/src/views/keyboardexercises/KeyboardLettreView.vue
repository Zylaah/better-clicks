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
        <h3>Taper le caractère suivant :</h3>
        <div class="lettre-and-symbols-container">
          <div class="lettre-and-symbols-item current">
            {{ currentLetter.display }}
          </div>
          <div v-show="isNaN(currentLetter.display)" class="case-info">
            {{ currentLetter.display === currentLetter.display.toUpperCase() ? 'Majuscule' : 'Minuscule' }}
          </div>
          <ProgressBar 
            :current-value="currentIndex + 1"
            :total-value="letters.length"
          />
        </div>
      </div>

      <div class="textarea-container">
        <RestartModal v-model="isExerciseComplete">
          <template #header>
            <h2>Félicitations !</h2>
          </template>
          
          <div class="modal-buttons">
            <button 
              class="restart-button"
              @click="restartExercise"
            >
              <font-awesome-icon icon="rotate-right" />
              Recommencer l'exercice
            </button>
            <button class="next-button" @click="goNext">
              <font-awesome-icon icon="arrow-right" />
              Passer à l'exercice suivant
            </button>
          </div>
        </RestartModal>

        <div v-show="!isExerciseComplete">
          <textarea 
            v-model="userInput"
            class="modern-textarea"
            :class="{ 'correct': isCorrect, 'incorrect': isIncorrect }"
            placeholder="Tapez la lettre ici..."
            rows="5"
            @input="checkLetter"
            @keydown.enter.prevent
          ></textarea>
        </div>

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
import ProgressBar from '@/components/ProgressBar.vue'
import RestartModal from '@/components/RestartModal.vue'
import GlobalKeyboard from '@/components/keyboard/GlobalKeyboard.vue'

// Cache pour les lettres générées
const letterCache = {
  cachedLetters: null,
  getCachedLetters() {
    if (!this.cachedLetters) {
      this.cachedLetters = LetterGenerator.generateRandomLetters()
    }
    return [...this.cachedLetters] // Retourne une copie pour éviter les modifications accidentelles
  },
  refreshCache() {
    this.cachedLetters = LetterGenerator.generateRandomLetters()
    return [...this.cachedLetters]
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

    return {
      store,
      typingSpeed,
      animationClasses,
      animateIfPossible
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
      }
    }
  },

  computed: {
    currentLetter() {
      return this.letters[this.currentIndex] || { char: '', display: '', modifiers: [] }
    },

    highlightedKeys() {
      const letter = this.currentLetter
      if (!letter?.char) return []
      
      if (this.cachedHighlightedKeys.char === letter.char && 
          this.cachedHighlightedKeys.modifiers === letter.modifiers) {
        return this.cachedHighlightedKeys.keys
      }
      
      return this.store.updateHighlightedKeysCache(letter.char, letter.modifiers)
    }
  },

  methods: {
    checkLetter() {
      const input = this.userInput.charAt(0)
      
      if (input === this.currentLetter.char) {
        this.isCorrect = true
        this.isIncorrect = false
        
        if (this.currentIndex === this.letters.length - 1) {
          this.isExerciseComplete = true
          this.validationMessage = 'Parfait ! Vous avez terminé toutes les lettres !'
        } else {
          this.validationMessage = 'Parfait ! Appuyez sur Entrée pour passer à la lettre suivante.'
          document.addEventListener('keydown', this.handleEnterKey)
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

    handleEnterKey(event) {
      if (event.key === 'Enter' && this.isCorrect) {
        if (this.currentIndex < this.letters.length - 1) {
          this.currentIndex++
          this.isCorrect = false
          this.validationMessage = ''
          this.userInput = ''
        }
        document.removeEventListener('keydown', this.handleEnterKey)
      }
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
    document.removeEventListener('keydown', this.handleEnterKey)
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
