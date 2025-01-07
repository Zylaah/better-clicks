<template>
  <div class="keyboard-test">
    
    <AzuretyKeyboard
      :show-debug-controls="true"
      :show-event-log="true"
      :max-log-entries="10"
      @key-press="handleKeyPress"
      @key-release="handleKeyRelease"
      @debug-toggle="handleDebugToggle"
      @debug-key-info="handleDebugKeyInfo"
    />
    <div class="example-phrase-container">
      <div class="example-phrases">
        <h3>Phrase à recopier :</h3>
        <div class="phrases-container">
          <div class="phrase-item current">
            {{ phrasesExemple[currentPhraseIndex] }}
          </div>
          <div class="progress-info">
            <span>Phrase {{ currentPhraseIndex + 1 }} sur {{ phrasesExemple.length }}</span>
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: `${((currentPhraseIndex + 1) / phrasesExemple.length) * 100}%` }"
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
            v-model="textContent"
            class="modern-textarea"
            :class="{ 'correct': isCorrect, 'incorrect': isIncorrect }"
            placeholder="Recopiez la phrase ici..."
            rows="5"
            @input="checkPhrase"
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
import phrases from '@/data/phrases.json'

export default {
  name: 'KeyboardTestView',
  
  components: {
    AzuretyKeyboard
  },

  data() {
    return {
      textContent: '',
      currentPhraseIndex: 0,
      isCorrect: false,
      isIncorrect: false,
      validationMessage: '',
      isExerciseComplete: false,
      phrasesExemple: this.getRandomPhrases(phrases.phrases, 15)
    }
  },

  methods: {
    getRandomPhrases(phrases, count) {
      return this.shuffleArray([...phrases]).slice(0, count);
    },

    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },

    checkPhrase() {
      const currentPhrase = this.phrasesExemple[this.currentPhraseIndex];
      
      if (this.textContent === currentPhrase) {
        this.isCorrect = true;
        this.isIncorrect = false;
        if (this.currentPhraseIndex === this.phrasesExemple.length - 1) {
          this.isExerciseComplete = true;
          this.validationMessage = 'Parfait ! Vous avez terminé toutes les phrases !';
        } else {
          this.validationMessage = 'Parfait ! Appuyez sur Entrée pour passer à la phrase suivante.';
          document.addEventListener('keydown', this.handleEnterKey);
        }
      } else {
        this.isCorrect = false;
        const isPartiallyCorrect = currentPhrase.startsWith(this.textContent);
        this.isIncorrect = !isPartiallyCorrect;
        this.validationMessage = '';
      }
    },

    restartExercise() {
      const allPhrases = this.phrasesExemple.concat(/* ... copier toutes les phrases ici ... */);
      this.phrasesExemple = this.getRandomPhrases(allPhrases, 15);
      this.currentPhraseIndex = 0;
      this.isExerciseComplete = false;
      this.isCorrect = false;
      this.isIncorrect = false;
      this.textContent = '';
      this.validationMessage = '';
    },

    handleEnterKey(event) {
      if (event.key === 'Enter') {
        if (this.isCorrect && this.currentPhraseIndex < this.phrasesExemple.length - 1) {
          this.currentPhraseIndex++;
          this.isCorrect = false;
          this.validationMessage = '';
        }
        this.textContent = '';
        this.isIncorrect = false;
        document.removeEventListener('keydown', this.handleEnterKey);
      }
    },

    handleKeyPress(event) {
      console.log('Touche pressée:', event)
    },

    handleKeyRelease(event) {
      console.log('Touche relâchée:', event)
    },

    handleDebugToggle(isEnabled) {
      console.log('Mode debug:', isEnabled)
    },

    handleDebugKeyInfo(keyInfo) {
      console.log('Info debug:', keyInfo)
    },

    selectPhrase(index) {
      this.currentPhraseIndex = index;
    },
    goBack() {
      this.$router.push({ name: 'keyboard-menu' })
    }
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
  height: clamp(3rem, 5vh, 6rem);
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
  font-size: 1.5rem;
  font-weight: bold;
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
    scale: 0.7;
  }
  .back-button-container {
    margin-top: 2rem;
  }
}

@media (max-width: 940px) {
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
