<template>
  <div class="keyboard-test">
    
    <AzuretyKeyboard
      :show-debug-controls="true"
      :show-event-log="true"
      :max-log-entries="10"
      @key-press="handleKeyPress"
      @key-release="handleKeyRelease"
    />

    <div class="example-phrase-container">
      <div class="example-phrases">
        <h3>Taper la lettre :</h3>
        <div class="phrases-container">
          <div class="phrase-item current">
            {{ currentLetter.display }}
          </div>
          <div class="progress-info">
            <span>Lettre {{ currentIndex + 1 }} sur {{ letters.length }}</span>
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: `${((currentIndex + 1) / letters.length) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="textarea-container">
        <textarea 
          v-model="userInput"
          class="modern-textarea"
          :class="{ 'correct': isCorrect, 'incorrect': isIncorrect }"
          placeholder="Tapez la lettre ici..."
          rows="5"
          @input="checkLetter"
          @keydown.enter.prevent
        ></textarea>
        <div class="validation-message" v-if="validationMessage">
          {{ validationMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AzuretyKeyboard from '@/components/keyboard/AzuretyKeyboard.vue'

export default {
  name: 'KeyboardLettreView',
  
  components: {
    AzuretyKeyboard
  },

  data() {
    return {
      userInput: '',
      currentIndex: 0,
      isCorrect: false,
      isIncorrect: false,
      validationMessage: '',
      letters: [
        { char: 'A', display: 'A (Majuscule)' },
        { char: 'k', display: 'k (Minuscule)' },
        { char: 'Z', display: 'Z (Majuscule)' },
        { char: 'p', display: 'p (Minuscule)' },
        // ... autres lettres ...
      ]
    }
  },

  computed: {
    currentLetter() {
      return this.letters[this.currentIndex] || { char: '', display: '' }
    }
  },

  methods: {
    checkLetter() {
      // Ne vérifie que le premier caractère si l'utilisateur en tape plusieurs
      const input = this.userInput.charAt(0)
      
      if (input === this.currentLetter.char) {
        this.isCorrect = true
        this.isIncorrect = false
        
        if (this.currentIndex === this.letters.length - 1) {
          this.validationMessage = 'Parfait ! Vous avez terminé toutes les lettres !'
          document.querySelector('textarea').disabled = true
          document.querySelector('textarea').placeholder = 'Vous avez terminé !'
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
    }
  },

  beforeUnmount() {
    document.removeEventListener('keydown', this.handleEnterKey)
  }
}
</script>

<style scoped>
.keyboard-test {
  margin-top: clamp(4rem, 6rem, 8rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: min(100dvh, 80vh);
  padding: 0;
}

h1 {
  color: var(--accent-color);
  margin-bottom: 2rem;
  font-size: 2rem;
  text-align: center;
}

.textarea-container {
  display: flex;
  padding: 1rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
}

.modern-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--accent-color);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-color);
  font-size: 1.1rem;
  line-height: 1.5;
  resize: none;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.modern-textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--accent-color-rgb), 0.3);
  border-color: var(--accent-color);
}

.modern-textarea::placeholder {
  color: rgba(var(--text-color-rgb), 0.5);
}

.example-phrase-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.example-phrases {
  padding: clamp(1rem, 2vh, 2rem);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.example-phrases h3 {
  color: var(--accent-color);
  margin-bottom: clamp(0.5rem, 1vh, 1rem);
  font-size: 1.2rem;
}

.phrases-container {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.phrase-item {
  padding: clamp(0.5rem, 1vh, 0.8rem);
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  color: var(--text-color);
}

.phrase-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.phrase-item.active {
  border-color: var(--accent-color);
  background-color: rgba(var(--accent-color-rgb), 0.1);
}

.phrase-item.current {
  border-color: var(--accent-color);
  background-color: rgba(var(--accent-color-rgb), 0.1);
  font-size: 1.1rem;
}

.progress-info {
  margin-top: clamp(0.5rem, 1vh, 1rem);
  text-align: center;
  color: var(--text-color);
}

.progress-bar {
  margin-top: clamp(0.25rem, 0.5vh, 0.5rem);
  width: 100%;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--accent-color);
  transition: width 0.3s ease;
}

.validation-message {
  margin-top: clamp(0.25rem, 0.5vh, 0.5rem);
  text-align: center;
  color: var(--accent-color);
  font-size: 0.9rem;
}

.modern-textarea.correct {
  border-color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.05);
}

.modern-textarea.incorrect {
  border-color: #f44336;
  background-color: rgba(244, 67, 54, 0.05);
}

@media (max-height: 816px) {
  .keyboard-test {
    scale: 0.8;
  }
  .back-button-container {
    margin-top: 2rem;
  }
}

@media (max-width: 1180px) {
  .keyboard-test {
    display: none;
  }
}
</style>
