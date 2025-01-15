<template>
  <div class="keyboard-test">
    <GlobalKeyboard
      :show-debug-controls="true"
      :show-event-log="true"
      :max-log-entries="10"
    />

    <div v-if="typingSpeed > 0" class="typing-speed">
      Vitesse de frappe : {{ typingSpeed }} frappes/minute
    </div>

    <div class="example-phrase-container">
      <div class="example-phrases">
        <h3>Phrase à recopier :</h3>
        <div class="phrases-container">
          <div class="phrase-item current">
            {{ phrasesExemple[currentPhraseIndex] }}
          </div>
          <ProgressBar 
            :current-value="currentPhraseIndex + 1"
            :total-value="phrasesExemple.length"
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
            v-model="textContent"
            class="modern-textarea"
            :class="{ 'correct': isCorrect, 'incorrect': isIncorrect }"
            placeholder="Recopiez la phrase ici..."
            rows="5"
            @input="checkPhrase"
            @keydown.enter.prevent
          ></textarea>
        </template>
        <div class="validation-message" :class="{ 'correct': isCorrect, 'incorrect': isIncorrect }" v-if="validationMessage">
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
import ProgressBar from '@/components/ProgressBar.vue'
import RestartModal from '@/components/RestartModal.vue'
import GlobalKeyboard from '@/components/keyboard/GlobalKeyboard.vue'

export default {
  name: 'KeyboardTestView',
  
  components: {
    GlobalKeyboard,
    ProgressBar,
    RestartModal
  },

  setup() {
    const store = useKeyboardStore()
    const { typingSpeed } = storeToRefs(store)

    return {
      store,
      typingSpeed
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
        
        if (!isPartiallyCorrect) {
          this.validationMessage = `
          Vous avez écrit : "${this.textContent}"
          Attendu : "${currentPhrase.slice(0, Math.max(this.textContent.length, 0))}"`;
        } else {
          this.validationMessage = '';
        }
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
      this.store.reset();
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

    selectPhrase(index) {
      this.currentPhraseIndex = index;
    },

    goBack() {
      this.$router.push({ name: 'keyboard-menu' })
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

</style>
