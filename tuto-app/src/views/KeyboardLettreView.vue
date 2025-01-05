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
        <h3>Taper le caractère suivant :</h3>
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
        <template v-if="isExerciseComplete">
          <button 
            class="restart-button"
            @click="restartExercise"
          >
            <font-awesome-icon icon="rotate-right" />
            Recommencer l'exercice
          </button>
        </template>
        <template v-else>
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
      letters: this.generateRandomLetters(),
      isExerciseComplete: false
    }
  },

  computed: {
    currentLetter() {
      return this.letters[this.currentIndex] || { char: '', display: '' }
    }
  },

  methods: {
    generateRandomLetters() {
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';
      const numbers = '0123456789';
      let characters = [];

      // Ajouter les lettres
      for (let letter of alphabet) {
        // 50% de chance d'être en majuscule
        const isUpperCase = Math.random() < 0.5;
        const char = isUpperCase ? letter.toUpperCase() : letter;
        characters.push({
          char,
          display: `${char} (${isUpperCase ? 'Majuscule' : 'Minuscule'})`
        });
      }

      // Ajouter les chiffres
      for (let number of numbers) {
        characters.push({
          char: number,
          display: `${number} (Shift + ${number})`
        });
      }

      // Mélanger le tableau
      return this.shuffleArray(characters);
    },

    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
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
      this.letters = this.generateRandomLetters()
      this.currentIndex = 0
      this.isExerciseComplete = false
      this.isCorrect = false
      this.isIncorrect = false
      this.userInput = ''
      this.validationMessage = ''
    }
  },

  beforeUnmount() {
    document.removeEventListener('keydown', this.handleEnterKey)
  }
}
</script>

<style scoped>
.keyboard-test {
  margin-top: clamp(6rem, 8rem, 10rem);
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
  align-items: center;
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

@media (max-height: 940px) {
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

.restart-button {
  width: 100%;
  padding: 1rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.restart-button:hover {
  transform: translateY(-2px);
  background-color: var(--accent-color-hover, #357b5e);
}

.restart-button:active {
  transform: translateY(0);
}
</style>
