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
            v-memo="[currentIndex]"
            :current-value="currentIndex + 1"
            :total-value="mots.length"
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
          v-model="userInput"
          :is-complete="isExerciseComplete"
          :is-correct="isCorrect"
          :is-incorrect="isIncorrect"
          :message="validationMessage"
          placeholder="Recopiez le mot ici..."
          @input="debouncedCheck"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useKeyboardExercise } from '@/composables/useKeyboardExercise'
import { WordGenerator } from '@/services/wordGenerator'
import { useCacheManager } from '@/composables/useCacheManager'
import { onBeforeMount, onBeforeUnmount, getCurrentInstance, computed } from 'vue'
import { defineAsyncComponent } from 'vue'
import GlobalKeyboard from '@/components/keyboard/GlobalKeyboard.vue'
import KeyboardTextArea from '@/components/keyboard/KeyboardTextArea.vue'
import { useRouter } from 'vue-router'

const createAsyncComponent = (loader, options = {}) => defineAsyncComponent({
  loader,
  loadingComponent: null,
  delay: 200,
  timeout: 3000,
  errorComponent: null,
  onError(error, retry, fail, attempts) {
    if (attempts <= 3) {
      retry()
    } else {
      console.error('Failed to load component:', error)
      fail()
    }
  },
  suspensible: true, // Permet une meilleure gestion de la mémoire avec Suspense
  ...options
})

const RestartModal = createAsyncComponent(() => import('@/components/RestartModal.vue'))
const ProgressBar = createAsyncComponent(() => import('@/components/ProgressBar.vue'))

export default {
  name: 'KeyboardMotView',
  
  components: {
    GlobalKeyboard,
    ProgressBar,
    RestartModal,
    KeyboardTextArea
  },

  setup() {
    const router = useRouter()
    const { proxy: app } = getCurrentInstance()
    
    const {
      userInput,
      currentIndex,
      items: mots,
      currentItem,
      isLastItem,
      typingSpeed,
      animationClasses,
      isCorrect,
      isIncorrect,
      isExerciseComplete,
      validationMessage,
      debounce,
      checkInput,
      resetExercise,
      cleanup: cleanupExercise
    } = useKeyboardExercise()

    const cacheManager = useCacheManager(100)
    
    const motCache = {
      getRandomMots(count, forceRefresh = false) {
        const cacheKey = `mots-${count}`
        if (!forceRefresh) {
          const cached = cacheManager.getFromCache(cacheKey)
          if (cached) return [...cached]
        }
        
        const randomMots = WordGenerator.generateRandomWords(count)
        cacheManager.addToCache(cacheKey, randomMots)
        return [...randomMots]
      }
    }

    // Initialize words
    mots.value = motCache.getRandomMots(20)

    const currentMot = computed(() => {
      return currentItem.value?.word || ''
    })
    
    // Load icons
    onBeforeMount(async () => {
      await Promise.all([
        app.$loadIcon('rotateRight'),
        app.$loadIcon('arrowRight')
      ])
    })

    const checkMot = () => {
      checkInput(userInput.value, currentMot.value, {
        isLastItem: isLastItem.value,
        successMessage: '',
        completeMessage: '',
        nextMessage: ''
      })
    }

    const restartExerciseHandler = () => {
      resetExercise(motCache.getRandomMots(20, true))
    }

    const goNext = () => {
      router.push({ name: 'keyboard-phrase' })
    }

    const debouncedCheck = debounce((event) => {
      userInput.value = event.target.value
      checkMot()
    }, 100)

    onBeforeUnmount(() => {
      cleanupExercise()
      cacheManager.stopCleanupInterval()
      cacheManager.cleanOldEntries()
    })

    return {
      // State
      userInput,
      currentIndex,
      mots,
      
      // Computed
      currentMot,
      
      // Validation state
      isCorrect,
      isIncorrect,
      isExerciseComplete,
      validationMessage,
      
      // Methods
      debouncedCheck,
      restartExercise: restartExerciseHandler,
      goNext,
      cleanupExercise,
      
      // Animation
      animationClasses,
      
      // Store
      typingSpeed
    }
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
