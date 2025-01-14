<template>
  <div class="keyboard-test">
    <AzuretyKeyboard
      :show-debug-controls="true"
      :show-event-log="true"
      :max-log-entries="10"
      @key-press="debouncedKeyPress"
      @key-release="debouncedKeyRelease"
      @debug-toggle="handleDebugToggle"
      @debug-key-info="handleDebugKeyInfo"
    />
    <div class="example-phrase-container">
      <div class="example-phrases">
        <h3>Mot à recopier :</h3>
        <div class="phrases-container">
          <div class="phrase-item current">
            {{ motsExemple[currentMotIndex] }}
          </div>
          <ProgressBar 
            :current-value="currentMotIndex + 1"
            :total-value="motsExemple.length"
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
            placeholder="Recopiez le mot ici..."
            rows="3"
            @input="checkMot"
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
import { defineAsyncComponent } from 'vue'
import { debounce } from '@/utils/eventHelper'
import mots from '@/data/mots.json'
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
  name: 'KeyboardMotView',
  
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
      textContent: '',
      currentMotIndex: 0,
      isCorrect: false,
      isIncorrect: false,
      validationMessage: '',
      isExerciseComplete: false,
      motsExemple: this.getRandomMots(mots.mots, 2),
      debouncedKeyPress: null,
      debouncedKeyRelease: null
    }
  },

  methods: {
    getRandomMots(mots, count) {
      return this.shuffleArray([...mots]).slice(0, count)
    },

    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
      }
      return array
    },

    checkMot() {
      const currentMot = this.motsExemple[this.currentMotIndex]
      
      if (this.textContent === currentMot) {
        this.isCorrect = true
        this.isIncorrect = false
        if (this.currentMotIndex === this.motsExemple.length - 1) {
          this.isExerciseComplete = true
          this.validationMessage = 'Parfait ! Vous avez terminé tous les mots !'
        } else {
          this.validationMessage = 'Parfait ! Appuyez sur Entrée pour passer au mot suivant.'
          document.addEventListener('keydown', this.handleEnterKey)
        }
      } else {
        this.isCorrect = false;
        const isPartiallyCorrect = currentMot.startsWith(this.textContent);
        this.isIncorrect = !isPartiallyCorrect;
        
        if (!isPartiallyCorrect) {
          this.validationMessage = `
          Vous avez écrit : "${this.textContent}"
          Attendu : "${currentMot.slice(0, Math.max(this.textContent.length, 0))}"`;
        } else {
          this.validationMessage = '';
        }
      }
    },

    handleEnterKey(event) {
      if (event.key === 'Enter') {
        if (this.isCorrect && this.currentMotIndex < this.motsExemple.length - 1) {
          this.currentMotIndex++
          this.isCorrect = false
          this.validationMessage = ''
        }
        this.textContent = ''
        this.isIncorrect = false
        document.removeEventListener('keydown', this.handleEnterKey)
      }
    },

    restartExercise() {
      this.motsExemple = this.getRandomMots(mots.mots, 20)
      this.currentMotIndex = 0
      this.isExerciseComplete = false
      this.isCorrect = false
      this.isIncorrect = false
      this.textContent = ''
      this.validationMessage = ''
    },

    goNext() {
      this.$router.push({ name: 'keyboard-phrase' })
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
