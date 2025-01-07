<template>
  <div class="container">
    <!-- Vue Exercices -->
    <div class="exercises-container fade">
      <h2 class="exercises-title">Exercices sur l'arborescence des fichiers</h2>
      <div class="exercises-grid">
        <div 
          v-for="(exercise, index) in exercises" 
          :key="index"
          class="card"
          @click="selectExercise(exercise)"
        >
          <strong>{{ exercise.title }}</strong>
          <div class="card_body">
            <p>{{ exercise.difficulty }}</p>
          </div>
          <span>Commencer</span>
        </div>
      </div>
      <component :is="currentExerciseComponent" :exercise="selectedExercise" v-if="selectedExercise" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import ExerciseTypeA from '@/components/ExerciseTypeA.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFolder, faFolderTree, faFile, faHome, faFolderOpen, faChevronRight, faChevronDown, faCompass, faFolderPlus, faSort, faSearch, faLock, faProjectDiagram, faDesktop, faCode, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import exercisesData from '@/data/exercises.json'

library.add(faFolder, faFolderTree, faFile, faHome, faFolderOpen, faChevronRight, faChevronDown, faCompass, faFolderPlus, faSort, faSearch, faLock, faProjectDiagram, faDesktop, faCode, faStar)

export default defineComponent({
  name: 'FileTreeView',
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      selectedExercise: null,
      exercises: exercisesData.map(exercise => ({
        ...exercise,
        component: exercise.type === 'A' ? ExerciseTypeA : null
      }))
    }
  },
  computed: {
    currentExerciseComponent() {
      return this.selectedExercise ? ExerciseTypeA : null
    }
  },
  created() {
    if (this.$route.query.view === 'exercises') {
      this.currentView = 'exercises'
    }
  },
  methods: {
    selectExercise(exercise) {
      this.$router.push({
        name: 'exercise',
        params: { exercise: JSON.stringify(exercise) }
      })
    }
  }
})
</script>

<style scoped>
/* Base styles */
.container {
  margin-top: clamp(0.2rem, 1rem, 2rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: min(100dvh, 80vh);
  padding: 0;
}

/* Exercises Container */
.exercises-container {
  width: min(95%, 60vw);
  padding: clamp(1rem, 4vh, 2rem) clamp(1rem, 3vw, 3rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
}

.exercises-title {
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  margin-bottom: clamp(0.2rem, 3vw, 1rem);
  margin-top: clamp(4rem, 6rem, 8rem);
  text-align: center;
  color: var(--accent-color);
}

.exercises-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: clamp(1rem, 2vw, 2rem);
  width: 100%;
  max-width: 1200px;
  margin: 1.5rem auto;
  padding: 0 1rem;
}

.card {
  position: relative;
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-color);
  overflow: hidden;
  cursor: pointer;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(var(--accent-color-rgb), 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--accent-color);
}

.card:hover::before {
  opacity: 1;
}

.card strong {
  font-size: clamp(1.1rem, 1.8vw, 1.3rem);
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.8rem;
  position: relative;
  z-index: 1;
}

.card_body {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 2;
}

.card_body p {
  display: inline-block;
  background: var(--accent-color);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0;
}

.card span {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  color: var(--accent-color);
  font-weight: 600;
  font-size: 1rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  z-index: 2;
}

.card:hover span {
  opacity: 1;
  transform: translateY(0);
}

/* Animation */
.fade {
  animation: fade 0.3s ease-in-out;
}

@keyframes fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Media queries */
@media (max-width: 768px) {
  .exercises-grid {
    grid-template-columns: 1fr;
  }

  .card {
    min-height: 180px;
  }
}

@media (max-height: 940px) {
  .container {
    scale: 0.8;
  }
  .exercises-title {
    margin-top: 2rem;
  }
}

@media (max-width: 940px) {
  .container {
    display: none;
  }
}
</style>