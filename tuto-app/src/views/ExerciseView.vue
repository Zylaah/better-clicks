<template>
  <div class="exercise-view">
    <div class="back-button-container">
      <button class="back-button" @click="goBack">
        <font-awesome-icon icon="arrow-left" /> Retour à l'explorateur
      </button>
    </div>
    <div class="exercise-container">
      <file-explorer :fileTree="exercise.fileTree">
        <div class="exercise-instructions">
          <h3>{{ exercise.title }}</h3>
          <div :class="{ 'exercise-instructions-container': true, 'vertical-layout': !exercise.hasInput }">
            <div class= "exercise-task">
              <h4>Consigne :</h4>
              <ul class="task-list">
                <li v-for="(step, index) in exercise.task.split('\n')" :key="index">{{ step }}</li>
              </ul>
            </div>
            <div v-if="exercise.hasHint && showHints" class="exercise-hint">
              <h4>Indice n°{{ hintIndex + 1 }}</h4>
              <p>{{ currentHint }}</p>
              <button @click="handleHintClick">
                {{ isLastHint ? 'Fermer' : 'Indice suivant' }}
              </button>
            </div>
          </div>
          <div v-if="exercise.hasInput" class="exercise-input-container">
            <input v-model="userInput" type="text" placeholder="Entrez votre réponse ici" class="exercise-input"/>
            <button class="exercise-input-button" @click="validateAnswer">Valider</button>
          </div>
          <div class="validation-message-container">
            <p v-if="validationMessage" :class="['validation-message', validationClass]">
              <font-awesome-icon :icon="validationIcon" /> {{ validationMessage }}
            </p>
          </div>
        </div>
      </file-explorer>
    </div>
  </div>
</template>

<script>
import FileExplorer from '@/components/FileExplorer.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ExerciseView',
  components: {
    FileExplorer
  },
  props: {
    exercise: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const userInput = ref('')
    const validationMessage = ref('')
    const hintIndex = ref(0)
    const showHints = ref(true)

    const currentHint = computed(() => {
      if (!props.exercise.hints || hintIndex.value >= props.exercise.hints.length) {
        return ''
      }
      return props.exercise.hints[hintIndex.value]
    })

    const isLastHint = computed(() => {
      if (!props.exercise.hints) return true
      return hintIndex.value === props.exercise.hints.length - 1
    })

    const handleHintClick = () => {
      if (isLastHint.value) {
        showHints.value = false
      } else {
        hintIndex.value++
      }
    }

    const validateAnswer = () => {
      if (userInput.value === props.exercise.expectedAnswer) {
        validationMessage.value = 'Bien joué !'
        userInput.value = ''
      } else {
        validationMessage.value = 'Aïe ! Ne te décourage pas, tu peux réessayer !'
        userInput.value = ''
      }
    }

    const goBack = () => {
      router.push({ name: 'file-tree', query: { view: 'exercises' } })
    }

    const validationClass = computed(() => {
      return validationMessage.value === 'Bien joué !' ? 'success' : 'error'
    })

    const validationIcon = computed(() => {
      return validationMessage.value === 'Bien joué !' ? 'fa-check' : 'fa-exclamation-triangle'
    })

    return {
      userInput,
      validationMessage,
      validationClass,
      goBack,
      hintIndex,
      currentHint,
      showHints,
      isLastHint,
      handleHintClick,
      validateAnswer,
      validationIcon
    }
  }
}
</script>

<style scoped>
.exercise-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(1rem, 2vw, 2rem);
}

.back-button-container {
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-top: max(10vh, 5rem);
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

.exercise-container {
  width: min(95%, 70vw);
  height: calc(75vh - clamp(2rem, 5vh, 4rem));
  position: relative;
  margin: clamp(1rem, 5vh, 2rem) auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

.exercise-instructions {
  padding: 0;
  background-color: var(--bg-primary);
  box-sizing: border-box;
  max-width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 clamp(1rem, 2vw, 2rem);
}

.exercise-instructions-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: clamp(3rem, 4vw, 4rem);
  flex-grow: 1;
  width: 100%;
}

.exercise-instructions h3 {
  color: var(--accent-color);
  margin: 0;
  font-size: clamp(1.5rem, 2.5vw, 1.8em);
  text-align: center;
  position: relative;
  padding-bottom: clamp(0.5rem, 1vw, 1rem);
  margin-top: clamp(1rem, 2vw, 2rem);
}

.exercise-instructions h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: var(--accent-color);
  border-radius: 2px;
}

.exercise-task {
  background-color: var(--bg-tertiary);
  border-radius: 10px;
  padding: clamp(0.5rem, 1vw, 1rem) clamp(0.5rem, 1vw, 1rem);
  margin-bottom: clamp(1rem, 2vw, 2rem);
  border: 1px solid var(--accent-color);
  width: 100%;
  min-height: 100px;
}

.exercise-task h4 {
  margin: 0 0 clamp(0.5rem, 1vw, 1rem) 0;
  color: var(--text-color);
  font-size: clamp(0.9rem, 1.5vw, 1rem);
}

.exercise-hint h4 {
  margin: 0 0 clamp(0.5rem, 1vw, 1rem) 0;
  color: var(--text-color);
  font-size: clamp(0.9rem, 1.5vw, 1rem);
}

.exercise-task p {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-size: clamp(0.8rem, 1.5vw, 0.9em);
  flex-grow: 1;
  display: flex;
}

.task-list {
 list-style-type: none;
 padding-left: 0;
 margin: 0;
}

.task-list li {
 padding: 0.5rem 0;
 color: var(--text-secondary);
 font-size: clamp(0.8rem, 1.5vw, 0.9em);
 display: flex;
 align-items: flex-start;
 position: relative;
 padding-left: 1.5rem;
}

.task-list li::before {
 content: "•";
 position: absolute;
 left: 0.5rem;
 color: var(--accent-color);
}

.exercise-hint {
  background-color: var(--bg-tertiary);
  border-radius: 10px;
  padding: clamp(0.5rem, 1vw, 1rem) clamp(0.5rem, 1vw, 1rem);
  margin-bottom: clamp(1rem, 2vw, 2rem);
  border: 1px solid #c58736;
  width: 50%;
  min-height: min(10vh, 100px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}

.exercise-hint p {
  margin: 0;
  color: var(--text-secondary);
  font-size: clamp(0.8rem, 1.5vw, 0.9em);
  flex-grow: 1;
  display: flex;
  word-wrap: break-word;
}

.exercise-hint button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: clamp(0.9rem, 1.5vw, 1rem);
  transition: all 0.2s ease;
  background-color: black;
  color: white;
  align-self: flex-start;
}

.exercise-hint button:hover {
  background-color: #c58736;
}

.validation-message-container {
  margin-top: 1rem;
}

.validation-message {
  padding: clamp(0.8rem, 1.5vw, 1.2rem);
  border-radius: 8px;
  margin: 1rem 0;
  font-size: clamp(0.9rem, 1.5vw, 1rem);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
}

.validation-message.success {
  background-color: var(--bg-tertiary);
  color: var(--text-color);
  border-left: 4px solid var(--accent-color);
}

.validation-message.error {
  background-color: var(--bg-tertiary);
  color: var(--text-color);
  border-left: 4px solid #f44336;
}

@keyframes slideIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
 }
 to {
   transform: translateY(0);
   opacity: 1;
 }
}

.validation-message.success svg {
  color: var(--accent-color);
}

.validation-message.error svg {
  color: #f44336;
}

.exercise-input-container {
  display: flex;
  gap: clamp(0.5rem, 1vw, 1rem);
  padding: clamp(0.5rem, 1vw, 1rem) clamp(0.5rem, 1vw, 1rem);
  margin-top: auto;
  background-color: var(--bg-secondary);
  border-radius: 10px;
  border: 1px solid var(--border-color);
  width: calc(100% - 2rem);
  margin: 0 auto;
}

.exercise-input {
  flex: 1;
  padding: clamp(0.5rem, 0.5vw, 1rem) clamp(0.5rem, 0.5vw, 1rem);
  border: 1px solid var(--border-color);
  border-radius: 5px;
  background-color: var(--bg-primary);
  color: var(--text-color);
}

.exercise-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.exercise-input-button {
  padding: 10px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.exercise-input-button:hover {
  background-color: var(--hover-color);
}

/* Personnalisation de la scrollbar comme dans FileExplorer */
.exercise-instructions::-webkit-scrollbar {
  width: clamp(0.5rem, 1vw, 1rem);
}

.exercise-instructions::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 4px;
}

.exercise-instructions::-webkit-scrollbar-thumb {
  background: var(--scrollbar-color);
  border-radius: 4px;
}

.exercise-instructions::-webkit-scrollbar-thumb:hover {
  background: var(--accent-color);
}



@media (max-width: 1180px) {
  .exercise-container {
    display: none;
  }

  .back-button {
    display: none;
  }
}
</style>