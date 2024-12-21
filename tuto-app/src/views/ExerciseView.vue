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
              <p>{{ exercise.task }}</p>
            </div>
            <div v-if="exercise.hasHint" class="exercise-hint">
              <h4>Indice :</h4>
              <p>{{ exercise.hint }}</p>
            </div>
          </div>
          <div v-if="exercise.hasInput" class="exercise-input-container">
            <input v-model="userInput" type="text" placeholder="Entrez votre réponse ici" class="exercise-input"/>
            <button class="exercise-input-button" @click="validateAnswer">Valider</button>
          </div>
          <div class="validation-message-container">
            <p v-if="validationMessage" :class="['validation-message', validationClass]">{{ validationMessage }}</p>
          </div>
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
  padding: clamp(1rem, 2vw, 2rem);
}

.back-button-container {
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-top: max(12vh, 6rem);
  z-index: 100;
  justify-content: center;
  width: 100%;
}

.back-button {
  padding: clamp(0.5rem, 1.5vw, 1rem) clamp(1rem, 2vw, 2rem);
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
  margin: clamp(2rem, 5vh, 4rem) auto 0;
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

.full-width {
  width: 100%;
  min-height: 80px;
}

.exercise-task h4 {
  margin: 0 0 clamp(0.5rem, 1vw, 1rem) 0;
  color: var(--text-color);
  font-size: clamp(0.9rem, 1.5vw, 1rem);
}

.exercise-task p {
  margin: 0;
  color: var(--text-secondary);
  font-size: clamp(0.8rem, 1.5vw, 0.9em);
  flex-grow: 1;
  display: flex;
}

.exercise-hint {
  background-color: var(--bg-secondary);
  border-radius: 10px;
  padding: clamp(0.5rem, 1vw, 1rem) clamp(1rem, 2vw, 2rem);
  margin-bottom: clamp(1rem, 2vw, 2rem);
  border: 1px solid var(--border-color);
  width: 50%;
}

.exercise-hint h4 {
  margin: 0 0 clamp(0.5rem, 1vw, 1rem) 0;
  color: var(--text-color);
  font-size: clamp(0.9rem, 1.5vw, 1rem);
}

.exercise-hint p {
  margin: 0;
  color: var(--text-secondary);
  font-size: clamp(0.8rem, 1.5vw, 0.9em);
  flex-grow: 1;
  display: flex;
  word-wrap: break-word;
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

.validation-message-container {
  display: flex;
  gap: clamp(0.5rem, 1vw, 1rem);
  width: 100%;
  margin: 0 auto;
}

.validation-message {
  padding: clamp(0.5rem, 1vw, 1rem) clamp(1rem, 2vw, 2rem);
  border-radius: 5px;
  text-align: center;
  width: 100%;
}

.success {
  background-color: var(--success-color);
  color: white;
}

.error {
  background-color: var(--error-color);
  color: white;
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

.mobile-message {
  display: none;
  text-align: center;
  padding: clamp(0.5rem, 1vw, 1rem) clamp(1rem, 2vw, 2rem);
  margin: clamp(0.5rem, 1vw, 1rem);
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

@media (max-width: 1180px) {
  .exercise-container {
    display: none;
  }

  .mobile-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>