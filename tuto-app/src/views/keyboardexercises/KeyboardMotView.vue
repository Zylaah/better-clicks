<template>
  <div class="keyboard-test" :class="animationClasses">
    <GlobalKeyboard
      v-memo="[currentMot, isCorrect, isIncorrect, validationMessage]"
      :show-debug-controls="true"
      :show-event-log="true"
      :max-log-entries="10"
    />

    <div v-if="isLoading" class="loading-container">
      <p>Chargement de l'exercice...</p>
    </div>

    <div v-else class="example-phrases">
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
      <Suspense>
        <template #default>
          <KeyboardTextArea
            v-memo="[currentMot, isCorrect, isIncorrect, validationMessage]"
            v-model="userInput"
            :is-complete="isExerciseComplete"
            :is-correct="isCorrect"
            :is-incorrect="isIncorrect"
            :message="validationMessage"
            :disabled="isLoading"
            placeholder="Recopiez le mot ici..."
            @input="onInput"
            @enter="checkMot"
          />
        </template>
        <template #fallback>
          <div class="loading-container">
            <p>Chargement de la zone de saisie...</p>
          </div>
        </template>
      </Suspense>
      
    </div>
  </div>
</template>

<script>
import { useKeyboardExercise } from '@/composables/useKeyboardExercise'
import { onBeforeMount, onBeforeUnmount, getCurrentInstance, computed, ref, onMounted } from 'vue'
import { defineAsyncComponent } from 'vue'
import GlobalKeyboard from '@/components/keyboard/GlobalKeyboard.vue'
import KeyboardTextArea from '@/components/keyboard/KeyboardTextArea.vue'
import { useRouter } from 'vue-router'
import { useExerciseCache } from '@/composables/useExerciseCache'

const createAsyncComponent = (loader, options = {}) => defineAsyncComponent({
  loader,
  loadingComponent: null,
  delay: 100,
  timeout: 5000,
  errorComponent: null,
  onError(error, retry, fail, attempts) {
    if (attempts <= 2) {
      setTimeout(retry, 200 * attempts)
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
    const exerciseCache = useExerciseCache()
    const isLoading = ref(true)
    const error = ref(null)
    
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
      checkInput,
      resetExercise,
      cleanup: cleanupExercise
    } = useKeyboardExercise()

    const initializeExercise = async () => {
      try {
        isLoading.value = true
        error.value = null
        const items = await exerciseCache.getItems('mots', 20)
        
        if (!items || items.length === 0) {
          throw new Error("Impossible de charger les mots pour l'exercice")
        }
        
        // Précharger le prochain lot
        exerciseCache.preloadNextExercises('mots', currentIndex.value)
        
        mots.value = items
        isLoading.value = false
      } catch (err) {
        console.error('Erreur lors du chargement des mots:', err)
        error.value = err.message
        isLoading.value = false
      }
    }

    onMounted(() => {
      initializeExercise()
    })
    
    // Load icons
    onBeforeMount(async () => {
      try {
        await Promise.all([
          app.$loadIcon('rotateRight'),
          app.$loadIcon('arrowRight')
        ])
      } catch (error) {
        console.warn('Erreur lors du chargement des icônes:', error)
      }
    })

    const checkMot = () => {
      checkInput(userInput.value, currentMot.value, {
        isLastItem: isLastItem.value,
        successMessage: 'Correct !',
        completeMessage: 'Exercice terminé !',
        nextMessage: 'Appuyez sur Entrée pour continuer',
        isEnterPressed: true
      })
    }

    const restartExerciseHandler = async () => {
      try {
        isLoading.value = true
        error.value = null
        const newItems = await exerciseCache.refreshCache('mots', 20)
        
        if (!newItems || newItems.length === 0) {
          throw new Error("Impossible de recharger les mots pour l'exercice")
        }
        
        resetExercise(newItems)
        isLoading.value = false
      } catch (err) {
        console.error('Erreur lors du redémarrage:', err)
        error.value = "Une erreur est survenue lors du redémarrage de l'exercice"
        isLoading.value = false
      }
    }

    const goNext = () => {
      router.push({ name: 'keyboard-phrase' })
    }

    const onInput = (event) => {
      if (event.key === 'Enter') {
        userInput.value = event.target.value
        checkMot()
      }
    }

    onBeforeUnmount(() => {
      cleanupExercise()
      exerciseCache.cleanup()
    })

    const currentMot = computed(() => {
      return currentItem.value?.word || ''
    })

    return {
      // State
      userInput,
      currentIndex,
      mots,
      isLoading,
      error,
      
      // Computed
      currentMot,
      
      // Validation state
      isCorrect,
      isIncorrect,
      isExerciseComplete,
      validationMessage,
      
      // Methods
      onInput,
      checkMot,
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
</style>
