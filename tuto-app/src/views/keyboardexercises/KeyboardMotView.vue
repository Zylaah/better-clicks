<template>
  <div class="keyboard-test" :class="animationClasses">
    <GlobalKeyboard
      :show-debug-controls="true"
      :show-event-log="true"
      :max-log-entries="10"
    />

    <div class="example-phrase-container slide-up">
      <div class="example-phrases">
        <h3 v-once>Mot à recopier :</h3>
        <div class="phrases-container">
          <div class="phrase-item current">
            {{ currentMot }}
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

        <KeyboardTextArea
          v-model="textContent"
          :is-complete="isExerciseComplete"
          :is-correct="isCorrect"
          :is-incorrect="isIncorrect"
          :message="validationMessage"
          placeholder="Recopiez le mot ici..."
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
import { useCacheManager } from '@/composables/useCacheManager'
import { useValidation } from '@/composables/useValidation'
import { useKeyboardEvents } from '@/composables/useKeyboardEvents'
import { WordGenerator } from '@/services/wordGenerator'
import ProgressBar from '@/components/ProgressBar.vue'
import RestartModal from '@/components/RestartModal.vue'
import GlobalKeyboard from '@/components/keyboard/GlobalKeyboard.vue'
import KeyboardTextArea from '@/components/keyboard/KeyboardTextArea.vue'

// Cache pour les mots avec gestionnaire de cache
const motCache = {
  cacheManager: useCacheManager(100),
  getRandomMots(count, difficulty = 'MEDIUM') {
    const cacheKey = `mots-${difficulty}-${count}`
    const cached = this.cacheManager.getFromCache(cacheKey)
    if (cached) return [...cached]
    
    const randomMots = WordGenerator.generateRandomWords(count, difficulty)
    this.cacheManager.addToCache(cacheKey, randomMots)
    return [...randomMots]
  }
}

export default {
  name: 'KeyboardMotView',
  
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

    return {
      store,
      typingSpeed,
      animationClasses,
      animateIfPossible,
      debouncedCheck: debounce((vm, input) => vm.checkMot(input), 100),
      clearDebounces,
      keyboardEvents,
      ...validation
    }
  },

  data() {
    return {
      textContent: '',
      currentMotIndex: 0,
      currentDifficulty: 'MEDIUM',
      motsExemple: motCache.getRandomMots(20, 'MEDIUM'),
      deadKeyActive: false,
      lastDeadKey: null
    }
  },

  computed: {
    currentMot() {
      const motObj = this.motsExemple[this.currentMotIndex]
      return motObj ? motObj.word : ''
    },

    currentChar() {
      const motObj = this.motsExemple[this.currentMotIndex]
      if (!motObj || !motObj.chars) return null
      const charIndex = this.textContent.length
      return charIndex < motObj.chars.length ? motObj.chars[charIndex] : null
    },

    isLastMot() {
      return this.currentMotIndex === this.motsExemple.length - 1
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
    getRandomMots(count, difficulty = 'MEDIUM') {
      return motCache.getRandomMots(count, difficulty)
    },

    checkMot() {
      const charInfo = this.currentChar
      if (!charInfo) return

      // Si c'est une touche morte
      if (charInfo.isDeadKey) {
        if (this.textContent === charInfo.char) {
          this.deadKeyActive = true
          this.lastDeadKey = charInfo.char
          this.isCorrect = true
          this.validationMessage = ''
          return
        }
      }
      // Si c'est un caractère composé
      else if (charInfo.isComposed) {
        if (this.deadKeyActive) {
          this.deadKeyActive = false
          this.lastDeadKey = null
          
          // On met à jour le texte avec le caractère composé
          const oldLength = this.textContent.length
          const previousText = this.textContent.slice(0, oldLength - 1)
          this.textContent = previousText + charInfo.display

          this.isCorrect = true
          this.validationMessage = ''
          return
        }
      }

      const result = this.validateInput(this.textContent, this.currentMot, {
        isLastItem: this.isLastMot,
        successMessage: '',
        completeMessage: '',
        nextMessage: ''
      })

      if (result.isCorrect && !result.isComplete) {
        this.keyboardEvents.addEnterKeyListener(() => {
          if (this.currentMotIndex < this.motsExemple.length - 1) {
            this.currentMotIndex++
            this.isCorrect = false
            this.validationMessage = ''
            this.textContent = ''
            this.deadKeyActive = false
            this.lastDeadKey = null
          }
        })
      }
    },

    restartExercise() {
      this.motsExemple = this.getRandomMots(20, this.currentDifficulty)
      this.currentMotIndex = 0
      this.textContent = ''
      this.resetValidation()
      this.store.reset()
      this.deadKeyActive = false
      this.lastDeadKey = null
    },

    goNext() {
      this.$router.push({ name: 'keyboard-phrase' })
    }
  },

  beforeUnmount() {
    this.clearDebounces()
    this.store.reset()
    motCache.cacheManager.cleanOldEntries()
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
