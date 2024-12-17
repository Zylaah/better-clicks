<template>
  <div class="exercise-view">
    <button class="back-button" @click="goBack">
      <font-awesome-icon icon="arrow-left" /> Retour à l'explorateur
    </button>
    <div class="exercise-container">
      <file-explorer :fileTree="exercise.fileTree">
        <div class="exercise-instructions">
          <h3>{{ exercise.title }}</h3>
          <p>{{ exercise.description }}</p>
          <div class="exercise-task">
            <p>Votre tâche : {{ exercise.task }}</p>
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
  methods: {
    goBack() {
      this.$router.push({ name: 'file-tree', query: { view: 'exercises' } })
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
  margin-left: 20px;
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
  margin-top: 20px;
  padding: 10px;
  background-color: var(--bg-primary);
  border-radius: 5px;
  color: var(--text-color);
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