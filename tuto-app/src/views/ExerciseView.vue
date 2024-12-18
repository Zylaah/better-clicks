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
  padding: 20px;
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
  width: 60vw;
  height: 70vh;
  position: relative;
  margin-top: 15vh;
}

.exercise-instructions {
  padding: 20px;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  box-shadow: 0 2px 4px var(--shadow-color);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.exercise-instructions h3 {
  color: var(--accent-color);
  margin-bottom: 20px;
}

.exercise-task {
  padding: 20px;
  background-color: var(--bg-primary);
  border-radius: 8px;
  box-shadow: 0 2px 4px var(--shadow-color);
  color: var(--text-color);
  width: 100%;
  max-width: 500px;
  text-align: center;
  border: 1px solid var(--border-color);
}

.exercise-task h4 {
  margin: 10px 0;
  color: var(--accent-color);
  font-size: 1.2em;
}

.exercise-input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 10px;
}

.exercise-input {
  margin-top: 10px;
  padding: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  color: var(--text-color);
  border-radius: 5px;
  width: 100%;
  max-width: 300px;
}

.exercise-input-button {
  margin-top: 10px;
  padding: 8px 15px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.exercise-input-button:hover {
  background-color: var(--hover-color);
}

.validation-message-container {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.validation-message {
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  max-width: 300px;
  align-self: center;
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