<template>
  <div class="keyboard-test" :class="animationClasses">
    <GlobalKeyboard
      :show-debug-controls="true"
      :show-event-log="true"
      :max-log-entries="10"
      :highlighted-keys="highlightedKeys"
    />

    <div class="example-phrase-container slide-up">
      <div class="example-phrases">
        <h3 v-once>Phrase à recopier :</h3>
        <div class="phrases-container">
          <div class="phrase-item current">
            {{ phrasesExemple[currentPhraseIndex] }}
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
import phrases from '@/data/phrases.json'
import { useOptimizedAnimations } from '@/composables/useOptimizedAnimations'
import { useDebounce } from '@/composables/useDebounce'
import { useCacheManager } from '@/composables/useCacheManager'
import { useValidation } from '@/composables/useValidation'
import { useKeyboardEvents } from '@/composables/useKeyboardEvents'
import ProgressBar from '@/components/ProgressBar.vue'
import RestartModal from '@/components/RestartModal.vue'
import GlobalKeyboard from '@/components/keyboard/GlobalKeyboard.vue'
import KeyboardTextArea from '@/components/keyboard/KeyboardTextArea.vue'

// Map des caractères avec leurs modifiers pour AZERTY
const AZERTY_CHAR_MODIFIERS = new Map([
  // Chiffres (tous avec Shift sur AZERTY)
  ['1', ['Shift']], ['2', ['Shift']], ['3', ['Shift']], ['4', ['Shift']], 
  ['5', ['Shift']], ['6', ['Shift']], ['7', ['Shift']], ['8', ['Shift']], 
  ['9', ['Shift']], ['0', ['Shift']],
  
  // Ponctuation haute
  ['!', ['Shift']], ['/', ['Shift']], ['\\', ['AltGr']], ['|', ['AltGr']],
  ['@', ['AltGr']], ['#', ['AltGr']], ['$', ['Shift']], ['€', ['AltGr']],
  ['£', ['Shift']], ['%', ['Shift']], ['?', ['Shift']], ['.', ['Shift']],
  ['/', ['Shift']], ['§', ['Shift']], ['&', ['Shift']], ['"', ['Shift']],
  ['\'', ['Shift']], ['(', ['Shift']], [')', ['Shift']], ['[', ['AltGr']],
  [']', ['AltGr']], ['{', ['AltGr']], ['}', ['AltGr']], ['<', ['Shift']],
  ['>', ['Shift']], ['°', ['Shift']], ['+', ['Shift']], ['=', ['Shift']],
  ['_', ['Shift']], ['µ', ['Shift']], ['*', ['Shift']], ['¨', ['Shift']],
  ['`', ['AltGr']], ['~', ['AltGr']], ['^', ['Shift']], ['¤', ['Shift']],
  [':', ['Shift']], [';', ['Shift']]
])

// Fonction pour détecter les majuscules
function isUpperCase(char) {
  return char === char.toUpperCase() && char !== char.toLowerCase()
}

// Cache pour les phrases avec gestionnaire de cache
const phraseCache = {
  cacheManager: useCacheManager(100),
  getRandomPhrases(count) {
    const cacheKey = `phrases-${count}`
    const cached = this.cacheManager.getFromCache(cacheKey)
    if (cached) return [...cached]

    if (!this.cacheManager.getFromCache('allPhrases')) {
      this.cacheManager.addToCache('allPhrases', [...phrases.phrases])
    }
    
    const randomPhrases = this.shuffleArray([...this.cacheManager.getFromCache('allPhrases')]).slice(0, count)
    this.cacheManager.addToCache(cacheKey, randomPhrases)
    return [...randomPhrases]
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
    const highlightedKeysCache = useCacheManager(20)
    const validation = useValidation({ maxCacheSize: 50 })
    const keyboardEvents = useKeyboardEvents()

    return {
      store,
      typingSpeed,
      animationClasses,
      animateIfPossible,
      debouncedCheck: debounce((vm, input) => vm.checkPhrase(input), 100),
      clearDebounces,
      highlightedKeysCache,
      keyboardEvents,
      ...validation
    }
  },

  data() {
    return {
      textContent: '',
      currentPhraseIndex: 0,
      phrasesExemple: phraseCache.getRandomPhrases(15),
      cachedHighlightedKeys: {
        char: null,
        modifiers: null,
        keys: []
      }
    }
  },

  computed: {
    currentPhrase() {
      return this.phrasesExemple[this.currentPhraseIndex] || ''
    },

    isLastPhrase() {
      return this.currentPhraseIndex === this.phrasesExemple.length - 1
    },

    currentCharToType() {
      const phrase = this.currentPhrase
      if (!phrase) return { char: '', display: '', modifiers: [] }
      const char = this.textContent.length < phrase.length ? phrase[this.textContent.length] : ''
      
      let modifiers = []
      // Vérifier si c'est une majuscule
      if (isUpperCase(char)) {
        modifiers.push('ShiftLeft')
      }
      // Vérifier si le caractère a des modifiers spéciaux
      const specialModifiers = AZERTY_CHAR_MODIFIERS.get(char)
      if (specialModifiers) {
        modifiers = [...new Set([...modifiers, ...specialModifiers])]
      }
      
      return {
        char,
        display: char,
        modifiers
      }
    },

    highlightedKeys() {
      return this.cachedHighlightedKeys.keys
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

  watch: {
    currentCharToType: {
      handler(current) {
        if (!current.char) {
          this.cachedHighlightedKeys = { char: null, modifiers: null, keys: [] }
          return
        }

        if (this.cachedHighlightedKeys.char !== current.char || 
            !this.arraysEqual(this.cachedHighlightedKeys.modifiers, current.modifiers)) {
          const keys = this.store.updateHighlightedKeysCache(current.char, current.modifiers)
          this.cachedHighlightedKeys = {
            char: current.char,
            modifiers: current.modifiers,
            keys: [...keys, ...current.modifiers]
          }
        }
      },
      immediate: true
    }
  },

  methods: {
    getRandomPhrases(count) {
      return phraseCache.getRandomPhrases(count)
    },

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
      this.phrasesExemple = this.getRandomPhrases(15)
      this.currentPhraseIndex = 0
      this.textContent = ''
      this.resetValidation()
      this.store.reset()
    },

    goNext() {
      this.$router.push({ name: 'keyboard-menu' })
    },

    arraysEqual(a, b) {
      if (!Array.isArray(a) || !Array.isArray(b)) return false
      if (a.length !== b.length) return false
      return a.every((val, index) => val === b[index])
    }
  },

  beforeUnmount() {
    this.clearDebounces()
    this.store.reset()
    this.highlightedKeysCache.clearCache()
    phraseCache.cacheManager.cleanOldEntries()
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
