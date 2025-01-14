<template>
  <div class="keyboard-test">
    
    <AzuretyKeyboard
      :show-debug-controls="true"
      :show-event-log="true"
      :max-log-entries="10"
      :highlighted-keys="highlightedKeys"
      @key-press="debouncedKeyPress"
      @key-release="debouncedKeyRelease"
    />

    <div class="example-phrase-container">
      <div class="example-phrases">
        <h3>Taper le caractère suivant :</h3>
        <div class="lettre-and-symbols-container">
          <div class="lettre-and-symbols-item current">
            {{ currentLetter.display }}
          </div>
          <div v-if="isNaN(currentLetter.display)" class="case-info">
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

        <template v-if="!isExerciseComplete">
          <textarea 
            v-model="userInput"
            class="modern-textarea"
            :class="{ 'correct': isCorrect, 'incorrect': isIncorrect }"
            placeholder="Tapez la lettre ici..."
            rows="5"
            @input="checkLetter"
            @keydown.enter.prevent
          ></textarea>
        </template>
        <div class="validation-message" v-if="validationMessage">
          {{ validationMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { debounce } from '@/utils/eventHelper'
import { LetterGenerator } from '@/services/letterGenerator'
import ProgressBar from '@/components/ProgressBar.vue'
import RestartModal from '@/components/RestartModal.vue'

const AzuretyKeyboard = defineAsyncComponent({
  loader: () => import('@/components/keyboard/AzuretyKeyboard.vue'),
  // Temps minimum avant d'afficher le loading
  delay: 200,
  // Temps maximum d'attente avant erreur
  timeout: 5000,
  // État pendant le chargement
  loadingComponent: {
    template: `
      <div class="keyboard-loading">
        <p>Chargement du clavier...</p>
      </div>
    `
  },
  // En cas d'erreur
  errorComponent: {
    template: `
      <div class="keyboard-error">
        <p>Erreur lors du chargement du clavier</p>
      </div>
    `
  },
  // Si le composant est en cours de chargement
  suspensible: true
})

export default {
  name: 'KeyboardLettreView',
  
  components: {
    AzuretyKeyboard,
    ProgressBar,
    RestartModal
  },

  created() {
    this.debouncedKeyPress = debounce(this.handleKeyPress, 16)
    this.debouncedKeyRelease = debounce(this.handleKeyRelease, 16)
  },

  data() {
    return {
      userInput: '',
      currentIndex: 0,
      isCorrect: false,
      isIncorrect: false,
      validationMessage: '',
      letters: LetterGenerator.generateRandomLetters(),
      isExerciseComplete: false,
      debouncedKeyPress: null,
      debouncedKeyRelease: null,
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
      
      return this.updateHighlightedKeysCache(letter.char, letter.modifiers)
    }
  },

  methods: {
    updateHighlightedKeysCache(char, modifiers) {
      this.cachedHighlightedKeys = {
        char,
        modifiers,
        keys: [char, ...(modifiers || [])]
      }
      return this.cachedHighlightedKeys.keys
    },

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

    handleKeyPress(event) {
      console.log('Touche pressée:', event)
    },

    handleKeyRelease(event) {
      console.log('Touche relâchée:', event)
    },

    goBack() {
      this.$router.push({ name: 'keyboard-menu' })
    },

    restartExercise() {
      this.letters = LetterGenerator.generateRandomLetters()
      this.currentIndex = 0
      this.isExerciseComplete = false
      this.isCorrect = false
      this.isIncorrect = false
      this.userInput = ''
      this.validationMessage = ''
      this.cachedHighlightedKeys = {
        char: null,
        modifiers: null,
        keys: []
      }
    },

    goNext() {
      this.$router.push({ name: 'keyboard-symboles' })
    }
  },

  beforeUnmount() {
    // Nettoyer les timeouts en attente
    if (this.debouncedKeyPress?.cancel) {
      this.debouncedKeyPress.cancel()
    }
    if (this.debouncedKeyRelease?.cancel) {
      this.debouncedKeyRelease.cancel()
    }
    document.removeEventListener('keydown', this.handleEnterKey)
  }
}
</script>

<style scoped>
@import '@/assets/styles/keyboard-exercises.css';

</style>
