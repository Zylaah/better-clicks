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
        <h3 v-once>Mot à recopier :</h3>
        <div class="phrases-container">
          <div class="phrase-item current">
            {{ motsExemple[currentMotIndex] }}
          </div>
          <ProgressBar 
            v-memo="[currentMotIndex]"
            :current-value="currentMotIndex + 1"
            :total-value="motsExemple.length"
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

        <textarea 
          v-show="!isExerciseComplete"
          v-model="textContent"
          class="modern-textarea"
          :class="{ 'correct': isCorrect, 'incorrect': isIncorrect }"
          placeholder="Recopiez le mot ici..."
          rows="5"
          @input="debouncedCheck(this, $event.target.value)"
          @keydown.enter.prevent
        ></textarea>
        
        <div v-show="validationMessage" class="validation-message" :class="{ 'correct': isCorrect, 'incorrect': isIncorrect }">
          {{ validationMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useKeyboardStore } from '@/stores/keyboard'
import { storeToRefs } from 'pinia'
import mots from '@/data/mots.json'
import { useOptimizedAnimations } from '@/composables/useOptimizedAnimations'
import { useDebounce } from '@/composables/useDebounce'
import ProgressBar from '@/components/ProgressBar.vue'
import RestartModal from '@/components/RestartModal.vue'
import GlobalKeyboard from '@/components/keyboard/GlobalKeyboard.vue'

// Cache pour les mots
const motCache = {
  allMots: [],
  getRandomMots(count) {
    if (this.allMots.length === 0) {
      this.allMots = [...mots.mots]
    }
    return this.shuffleArray([...this.allMots]).slice(0, count)
  },
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }
}

export default {
  name: 'KeyboardMotView',
  
  components: {
    GlobalKeyboard,
    ProgressBar,
    RestartModal
  },

  setup() {
    const store = useKeyboardStore()
    const { typingSpeed } = storeToRefs(store)
    const { animationClasses, animateIfPossible } = useOptimizedAnimations()
    const { debounce, clearDebounces } = useDebounce()

    return {
      store,
      typingSpeed,
      animationClasses,
      animateIfPossible,
      debouncedCheck: debounce((vm, input) => vm.checkMot(input), 100),
      clearDebounces
    }
  },

  data() {
    return {
      textContent: '',
      currentMotIndex: 0,
      isCorrect: false,
      isIncorrect: false,
      validationMessage: '',
      isExerciseComplete: false,
      motsExemple: motCache.getRandomMots(20),
      cachedHighlightedKeys: {
        char: null,
        modifiers: null,
        keys: []
      },
      enterKeyListener: null
    }
  },

  computed: {
    currentMot() {
      return this.motsExemple[this.currentMotIndex] || ''
    },

    isLastMot() {
      return this.currentMotIndex === this.motsExemple.length - 1
    },

    currentCharToType() {
      const mot = this.currentMot
      if (!mot) return ''
      return this.textContent.length < mot.length ? mot[this.textContent.length] : ''
    },

    shouldUpdateHighlightedKeys() {
      return this.cachedHighlightedKeys.char !== this.currentCharToType
    },

    highlightedKeys() {
      const currentChar = this.currentCharToType
      if (!currentChar) return []
      
      if (!this.shouldUpdateHighlightedKeys) {
        return this.cachedHighlightedKeys.keys
      }
      
      return this.store.updateHighlightedKeysCache(currentChar, [])
    },

    isPartiallyCorrect() {
      return this.currentMot.startsWith(this.textContent)
    },

    validationErrorMessage() {
      if (!this.textContent || this.isPartiallyCorrect) return ''
      return `Vous avez écrit : "${this.textContent}"
      Attendu : "${this.currentMot.slice(0, Math.max(this.textContent.length, 0))}"`
    }
  },

  methods: {
    getRandomMots(count) {
      return motCache.getRandomMots(count)
    },

    checkMot() {
      if (this.textContent === this.currentMot) {
        this.isCorrect = true
        this.isIncorrect = false
        
        if (this.isLastMot) {
          this.isExerciseComplete = true
          this.validationMessage = 'Parfait ! Vous avez terminé tous les mots !'
        } else {
          this.validationMessage = 'Parfait ! Appuyez sur Entrée pour passer au mot suivant.'
          this.addEnterKeyListener()
        }
      } else {
        this.isCorrect = false
        this.isIncorrect = !this.isPartiallyCorrect
        this.validationMessage = this.validationErrorMessage
      }
    },

    addEnterKeyListener() {
      if (this.enterKeyListener) {
        document.removeEventListener('keydown', this.enterKeyListener)
      }
      
      this.enterKeyListener = (event) => {
        if (event.key === 'Enter') {
          if (this.isCorrect && this.currentMotIndex < this.motsExemple.length - 1) {
            this.currentMotIndex++
            this.isCorrect = false
            this.validationMessage = ''
          }
          this.textContent = ''
          this.isIncorrect = false
          document.removeEventListener('keydown', this.enterKeyListener)
          this.enterKeyListener = null
        }
      }
      
      document.addEventListener('keydown', this.enterKeyListener, { passive: true })
    },

    restartExercise() {
      this.motsExemple = this.getRandomMots(20)
      this.currentMotIndex = 0
      this.isExerciseComplete = false
      this.isCorrect = false
      this.isIncorrect = false
      this.textContent = ''
      this.validationMessage = ''
      this.store.reset()
    },

    goNext() {
      this.$router.push({ name: 'keyboard-phrase' })
    }
  },

  beforeUnmount() {
    if (this.enterKeyListener) {
      document.removeEventListener('keydown', this.enterKeyListener)
    }
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
