<template>
  <div class="exercise-view">
    <button class="back-button" @click="goBack">
      <font-awesome-icon icon="arrow-left" /> Retour à l'explorateur
    </button>
    <div class="exercise-container">
      <file-explorer :fileTree="exercise.fileTree">
        <div class="exercise-instructions">
          <h3>{{ exercise.title }}</h3>
          <div class="exercise-task">
            <h4>Tâche</h4>
            <p>{{ exercise.task }}</p>
          </div>
        </div>
        <div v-if="exercise.hasInput" class="exercise-input-container">
          <input v-model="userInput" type="text" placeholder="Entrez votre réponse ici" class="exercise-input"/>
          <button class="exercise-input-button" @click="validateAnswer">Valider</button>
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
      } else {
        this.validationMessage = 'Réponse incorrecte. Veuillez réessayer.';
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
  padding: 150px;
}

.back-button {
  position: absolute;
  top: 80px;
  left: 20px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: var(--hover-color);
}

.exercise-container {
  width: 60%;
  height: 60vh;
  position: relative;
  margin-top: 20px;
}

.exercise-instructions {
  height: calc(70% - 60px);
  overflow-y: auto;
  background-color: var(--bg-primary);
}

.exercise-instructions h3 {
  color: var(--accent-color);
  margin-bottom: 30px;
  font-size: 1.8em;
  text-align: center;
  width: 100%;
  position: relative;
  padding-bottom: 15px;
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
  background-color: var(--bg-secondary);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
}

.exercise-task h4 {
  margin: 0 0 10px 0;
  color: var(--text-color);
  font-size: 1.1em;
}

.exercise-task p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.exercise-input-container {
  display: flex;
  gap: 10px;
  padding: 15px;
  background-color: var(--bg-secondary);
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.exercise-input {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  background-color: var(--bg-primary);
  color: var(--text-color);
}

.exercise-input-button {
  padding: 8px 16px;
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
  margin-top: 15px;
  padding: 0 15px;
}

.validation-message {
  padding: 10px;
  border-radius: 5px;
  text-align: center;
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
  width: 8px;
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

@media (max-width: 1024px) {
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