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
            <div :class="{ 'exercise-task': true, 'modified-width': !exercise.hasInput }">
              <h4>Consigne :</h4>
              <p>{{ exercise.task }}</p>
            </div>
            <div v-if="exercise.hasHint" :class="{ 'exercise-hint': true, 'modified-width': !exercise.hasInput }">
              <h4>Indice :</h4>
              <p>{{ exercise.hint }}</p>
            </div>
          </div>
          <div v-if="exercise.hasInput" class="exercise-input-container">
            <input v-model="userInput" type="text" placeholder="Entrez votre réponse ici" class="exercise-input"/>
            <button class="exercise-input-button" @click="validateAnswer">Valider</button>
          </div>
        </div>
        <div class="validation-message-container">
          <p v-if="validationMessage" :class="['validation-message', validationClass]">{{ validationMessage }}</p>
        </div>
      </file-explorer>
    </div>
    <div class="mobile-message">
      <font-awesome-icon icon="desktop" class="desktop-icon" />
      <h2>Version Desktop uniquement</h2>
      <p>Ce module n'est disponible que sur ordinateur pour une meilleure expérience d'apprentissage.</p>
    </div>
  </div>
</template>

<script>
import FileExplorer from '@/components/FileExplorer.vue'

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
  data() {
    return {
      userInput: '',
      validationMessage: ''
    }
  },
  computed: {
    validationClass() {
      return this.validationMessage === 'Réponse correcte !' ? 'success' : 'error';
    }
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'file-tree', query: { view: 'exercises' } })
    },
    validateAnswer() {
      if (this.userInput === this.exercise.expectedAnswer) {
        this.validationMessage = 'Réponse correcte !';
        this.userInput = '';
      } else {
        this.validationMessage = 'Réponse incorrecte. Veuillez réessayer.';
        this.userInput = '';
      }
    }
  }
}
</script>

<style scoped>
.exercise-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(1rem, 2vw, 1.25rem);
  min-height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
}

.back-button-container {
  display: flex;
  gap: clamp(0.5rem, 1vw, 0.625rem);
  margin-top: max(11vh, 4rem);
  z-index: 100;
  justify-content: center;
  width: 100%;
}

.back-button {
  padding: clamp(0.5rem, 1.5vw, 0.625rem) clamp(1rem, 2vw, 1.25rem);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  transition: all 0.2s ease;
  background-color: var(--accent-color);
  color: var(--text-color);
}

.back-button:hover {
  transform: translateY(-2px);
}

.exercise-container {
  width: min(95%, 60vw);
  height: calc(70vh - clamp(2rem, 5vh, 4rem));
  position: relative;
  margin: clamp(2rem, 5vh, 3.125rem) auto 0;
  display: flex;
  flex-direction: column;
}

.exercise-instructions {
  padding: clamp(1rem, 2vw, 1.25rem);
  background-color: var(--bg-primary);
  box-sizing: border-box;
  max-width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.exercise-instructions h3 {
  color: var(--accent-color);
  margin-bottom: clamp(1.5rem, 3vw, 1.875rem);
  margin-top: clamp(0.5rem, 1vw, 0.625rem);
  font-size: clamp(1.5rem, 2.5vw, 1.8rem);
  text-align: center;
  position: relative;
  padding-bottom: 0.9375rem;
  flex-shrink: 0;
}

.exercise-instructions-container {
  display: flex;
  gap: clamp(1rem, 2vw, 1.25rem);
  margin-top: clamp(1rem, 2vw, 1.25rem);
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.exercise-task {
  background-color: var(--bg-tertiary);
  border-radius: 10px;
  padding: clamp(0.9375rem, 2vw, 1.25rem);
  margin-bottom: clamp(1rem, 2vw, 1.25rem);
  border: 1px solid var(--accent-color);
  width: 100%;
  height: calc(10vh - clamp(1rem, 2vw, 1.25rem));
  overflow-y: auto;
}

.exercise-task h4 {
  margin: 0 0 clamp(0.5rem, 1vw, 0.625rem) 0;
  color: var(--text-color);
  font-size: clamp(1rem, 1.5vw, 1.1rem);
}

.exercise-task p {
  margin: 0;
  color: var(--text-secondary);
  font-size: clamp(0.875rem, 1.2vw, 0.9rem);
  flex-grow: 1;
  display: flex;
}

.exercise-hint {
  background-color: var(--bg-secondary);
  border-radius: 10px;
  padding: clamp(0.9375rem, 2vw, 1.25rem);
  margin-bottom: clamp(1rem, 2vw, 1.25rem);
  border: 1px solid var(--border-color);
  width: 100%;
  min-height: min-content;
  max-height: 100%;
  overflow-y: auto;
}

.exercise-hint h4 {
  margin: 0 0 clamp(0.5rem, 1vw, 0.625rem) 0;
  color: var(--text-color);
  font-size: clamp(1rem, 1.5vw, 1.1rem);
}

.exercise-hint p {
  margin: 0;
  color: var(--text-secondary);
  font-size: clamp(0.875rem, 1.2vw, 0.9rem);
  flex-grow: 1;
  display: flex;
  word-wrap: break-word;
}

.exercise-input-container {
  display: flex;
  gap: clamp(0.5rem, 1vw, 0.625rem);
  padding: clamp(0.9375rem, 2vw, 1.25rem);
  margin-top: auto;
  background-color: var(--bg-secondary);
  border-radius: 10px;
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.exercise-input {
  flex: 1;
  padding: clamp(0.5rem, 1vw, 0.625rem);
  border: 1px solid var(--border-color);
  border-radius: 5px;
  background-color: var(--bg-primary);
  color: var(--text-color);
  font-size: clamp(0.875rem, 1.2vw, 1rem);
}

.exercise-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.exercise-input-button {
  padding: clamp(0.5rem, 1vw, 0.625rem) clamp(0.75rem, 1.5vw, 1rem);
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: clamp(0.875rem, 1.2vw, 1rem);
}


.vertical-layout {
  flex-direction: column;
  align-items: center;
}

.modified-width {
  width: calc(100% - clamp(2rem, 4vw, 3.75rem));
  margin: clamp(0.5rem, 1vw, 0.625rem);
}

.validation-message-container {
  margin-top: clamp(0.9375rem, 2vw, 1.25rem);
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  padding: 0 clamp(0.9375rem, 2vw, 1.25rem);
}

.validation-message {
  padding: clamp(0.625rem, 1.5vw, 0.9375rem);
  border-radius: 5px;
  text-align: center;
  margin: clamp(1rem, 2vw, 1.25rem);
  font-size: clamp(0.875rem, 1.2vw, 1rem);
}

.success {
  background-color: var(--success-color);
  color: white;
}

.error {
  background-color: var(--error-color);
  color: white;
}

.mobile-message {
  display: none;
  text-align: center;
  padding: 30px;
  margin: 20px;
  background: var(--bg-secondary);
  border-radius: 10px;
  box-shadow: 0 2px 4px var(--shadow-color);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 400px;
}

/* Media Queries */
@media screen and (max-width: 1366px) {
  .exercise-container {
    width: min(100%, 80vw);
  }

  .exercise-instructions-container {
    overflow-y: auto;
  }
}

@media screen and (max-width: 1180px) {
  .exercise-container {
    display: none;
  }

  .mobile-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: clamp(1.5rem, 3vw, 1.875rem);
    margin: clamp(1rem, 2vw, 1.25rem);
    background: var(--bg-secondary);
    border-radius: 10px;
    box-shadow: 0 2px 4px var(--shadow-color);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(80%, 400px);
  }
}

/* Animation Optimizations */
@media (prefers-reduced-motion: reduce) {
  .back-button:hover {
    transform: none;
  }
}
</style>