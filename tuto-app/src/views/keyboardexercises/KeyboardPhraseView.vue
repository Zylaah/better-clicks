<template>
  <div class="keyboard-test" :class="animationClasses">
    <GlobalKeyboard
      :show-debug-controls="true"
      :show-event-log="true"
      :max-log-entries="10"
    />

    <div class="example-phrase-container slide-up">
      <div class="example-phrases">
        <h3 v-once>Phrase à recopier :</h3>
        <div class="phrases-container">
          <div class="phrase-item current">
            {{ currentPhrase }}
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

        <KeyboardTextArea
          v-model="textContent"
          :is-complete="isExerciseComplete"
          :is-correct="isCorrect"
          :is-incorrect="isIncorrect"
          :message="validationMessage"
          placeholder="Recopiez la phrase ici..."
          @input="debouncedCheck(this, $event.target.value)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useKeyboardStore } from '@/stores/keyboard'
import { storeToRefs } from 'pinia'
import { useOptimizedAnimations } from '@/composables/useOptimizedAnimations'
import { useDebounce } from '@/composables/useDebounce'
import { useValidation } from '@/composables/useValidation'
import { useKeyboardEvents } from '@/composables/useKeyboardEvents'
import { PhraseGenerator } from '@/services/phraseGenerator'
import ProgressBar from '@/components/ProgressBar.vue'
import { defineAsyncComponent, getCurrentInstance, onBeforeMount } from 'vue'
import GlobalKeyboard from '@/components/keyboard/GlobalKeyboard.vue'
import KeyboardTextArea from '@/components/keyboard/KeyboardTextArea.vue'

const RestartModal = defineAsyncComponent({
  loader: () => import('@/components/RestartModal.vue'),
  loadingComponent: null, // Composant à afficher pendant le chargement
  delay: 200, // Délai avant d'afficher le composant de chargement
  timeout: 3000, // Temps maximum de chargement
  errorComponent: null, // Composant à afficher en cas d'erreur
  onError(error, retry, fail, attempts) {
    if (attempts <= 3) {
      retry()
    } else {
      fail()
    }
  }
})

export default {
  name: 'KeyboardPhraseView',
  
  components: {
    GlobalKeyboard,
    ProgressBar,
    RestartModal,
    KeyboardTextArea
  },

  setup() {
    const store = useKeyboardStore()
    const { typingSpeed } = storeToRefs(store)
    const { animationClasses, animateIfPossible } = useOptimizedAnimations()
    const { debounce, clearDebounces } = useDebounce()
    const validation = useValidation({ maxCacheSize: 50 })
    const keyboardEvents = useKeyboardEvents()
    const { proxy: app } = getCurrentInstance()

    onBeforeMount(async () => {
      await Promise.all([
        app.$loadIcon('rotateRight'),
        app.$loadIcon('arrowRight')
      ])
    })

    return {
      store,
      typingSpeed,
      animationClasses,
      animateIfPossible,
      debouncedCheck: debounce((vm, input) => vm.checkPhrase(input), 100),
      clearDebounces,
      keyboardEvents,
      ...validation
    }
  },

  data() {
    return {
      textContent: '',
      currentPhraseIndex: 0,
      currentDifficulty: 'MEDIUM',
      phrasesExemple: []
    }
  },

  computed: {
    currentPhrase() {
      const phraseObj = this.phrasesExemple[this.currentPhraseIndex]
      return phraseObj ? phraseObj.text : ''
    },

    isLastPhrase() {
      return this.currentPhraseIndex === this.phrasesExemple.length - 1
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

  created() {
    this.phrasesExemple = PhraseGenerator.generateRandomPhrases(15, this.currentDifficulty)
  },

  methods: {
    checkPhrase() {
      const result = this.validateInput(this.textContent, this.currentPhrase, {
        isLastItem: this.isLastPhrase,
        successMessage: '',
        completeMessage: '',
        nextMessage: ''
      })

      if (result.isCorrect && !result.isComplete) {
        this.keyboardEvents.addEnterKeyListener(() => {
          if (this.currentPhraseIndex < this.phrasesExemple.length - 1) {
            this.currentPhraseIndex++
            this.isCorrect = false
            this.validationMessage = ''
            this.textContent = ''
          }
        })
      }
    },

    restartExercise() {
      this.phrasesExemple = PhraseGenerator.generateRandomPhrases(15, this.currentDifficulty)
      this.currentPhraseIndex = 0
      this.textContent = ''
      this.resetValidation()
      this.store.reset()
    },

    goNext() {
      this.$router.push({ name: 'keyboard-menu' })
    }
  },

  beforeUnmount() {
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
