<template>
  <div class="keyboard-test">
    <div class="back-button-container">
      <button class="back-button" @click="goBack">
        <font-awesome-icon icon="arrow-left" /> Retour à l'explorateur
      </button>
    </div>
    
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
        "L'été, mon frère aîné va à l'école à vélo.",
        "Les élèves étudient le français et les mathématiques.",
        "Où est-ce que tu as mis le gâteau au chocolat ?",
        "Mon père m'a offert un cadeau spécial pour Noël !",
        "J'aime beaucoup me promener dans les jardins publics.",
        "Ma soeur préfère écouter de la musique classique.",
        "Nous allons souvent au cinéma le week-end.",
        "Le petit chat noir dort sur le canapé.",
        "Il fait très beau aujourd'hui, allons à la plage !",
        "Les oiseaux chantent dans les arbres au printemps."
      ]
    }
  },

  methods: {
    checkPhrase() {
      const currentPhrase = this.phrasesExemple[this.currentPhraseIndex];
      
      if (this.textContent === currentPhrase) {
        this.isCorrect = true;
        this.isIncorrect = false;
        if (this.currentPhraseIndex === this.phrasesExemple.length - 1) {
          this.validationMessage = 'Parfait ! Vous avez terminé toutes les phrases !';
          document.querySelector('textarea').disabled = true;
          document.querySelector('textarea').placeholder = 'Vous avez terminé !';
        } else {
          this.validationMessage = 'Parfait ! Appuyez sur Entrée pour passer à la phrase suivante.';
        }
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
    },
    goBack() {
      this.$router.push({ name: 'keyboard-menu' })
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

.back-button-container {
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-top: max(12vh, 7rem);
  z-index: 100;
  justify-content: center;
  width: 100%;
}

.back-button {
  padding: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: clamp(0.9rem, 1.5vw, 1rem);
  transition: all 0.2s ease;
  background-color: var(--accent-color);
  color: var(--text-color);
}

.back-button:hover {
  transform: translateY(-2px);
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
