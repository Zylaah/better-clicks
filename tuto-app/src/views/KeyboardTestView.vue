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
              :style="{ width: `${(currentPhraseIndex / phrasesExemple.length) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="textarea-container">
      <textarea 
        v-model="textContent"
        class="modern-textarea"
        :class="{ 'correct': isCorrect, 'incorrect': isIncorrect }"
        placeholder="Recopiez la phrase ici..."
        rows="5"
        @input="checkPhrase"
        @keydown.enter.prevent
      ></textarea>
      <div class="validation-message" v-if="validationMessage">
          {{ validationMessage }}
      </div>
    </div>
  </div>
  
</template>

<script>
import AzuretyKeyboard from '@/components/keyboard/AzuretyKeyboard.vue'

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
      phrasesExemple: [
        "Le vif zéphyr jubile sur les kumquats du clown gracieux.",
        "Portez ce vieux whisky au juge blond qui fume.",
        "Dès Noël où un zéphyr haï me vêt de glaçons würmiens je dîne d'exquis rôtis de bœuf au kir à l'aÿ d'âge mûr & cætera.",
        "Les naïfs ægithales hâtifs pondant à Noël où il gèle sont sûrs d'être déçus en voyant leurs œufs abîmés."
      ]
    }
  },

  methods: {
    checkPhrase() {
      const currentPhrase = this.phrasesExemple[this.currentPhraseIndex];
      
      if (this.textContent === currentPhrase) {
        this.isCorrect = true;
        this.isIncorrect = false;
        this.validationMessage = 'Parfait ! Appuyez sur Entrée pour passer à la phrase suivante.';
        document.addEventListener('keydown', this.handleEnterKey);
      } else {
        this.isCorrect = false;
        const isPartiallyCorrect = currentPhrase.startsWith(this.textContent);
        this.isIncorrect = !isPartiallyCorrect;
        this.validationMessage = '';
      }
    },

    handleEnterKey(event) {
      if (event.key === 'Enter') {
        if (this.isCorrect && this.currentPhraseIndex < this.phrasesExemple.length - 1) {
          this.currentPhraseIndex++;
          this.isCorrect = false;
          this.validationMessage = '';
        } else if (this.isCorrect) {
          this.validationMessage = 'Félicitations ! Vous avez terminé toutes les phrases !';
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
    }
  }
}
</script>

<style scoped>
.keyboard-test {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
}

h1 {
  color: var(--accent-color);
  margin-bottom: 2rem;
  font-size: 2rem;
  text-align: center;
}

.textarea-container {
  margin-top: 2rem;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
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

.example-phrases {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.example-phrases h3 {
  color: var(--accent-color);
  margin-bottom: 1rem;
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
  padding: 0.8rem;
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
  margin-top: 1rem;
  text-align: center;
  color: var(--text-color);
}

.progress-bar {
  margin-top: 0.5rem;
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
  margin-top: 0.5rem;
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
    margin-top: max(7vh, 4rem);
  }

  .example-phrases {
    padding: 0;
    display: block;
  }
}

@media (max-width: 1180px) {
  .keyboard-test {
    display: none;
  }
}
</style>
