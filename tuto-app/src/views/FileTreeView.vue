<template>
  <div class="container">
    <!-- Message pour mobile et tablette -->
    <div class="mobile-message">
      <font-awesome-icon icon="desktop" class="desktop-icon" />
      <h2>Version Desktop uniquement</h2>
      <p>Ce module n'est disponible que sur ordinateur pour une meilleure expérience d'apprentissage.</p>
    </div>

    <!-- Contenu desktop -->
    <div class="desktop-content">
      <!-- Boutons de navigation -->
      <div class="navigation-buttons">
        <button 
          :class="['nav-button', { active: currentView === 'demo' }]"
          @click="currentView = 'demo'"
        >
          Démonstration
        </button>
        <button 
          :class="['nav-button', { active: currentView === 'exercises' }]"
          @click="currentView = 'exercises'"
        >
          Les exercices
        </button>
      </div>

      <!-- Vue Démonstration -->
      <div v-if="currentView === 'demo'" class="demo-container fade">
        <file-explorer :fileTree="fileTree">
          <div class="file-system-explanation">
            <h4 class="modern-title">
              <font-awesome-icon icon="folder-tree" class="title-icon" />
              Découvrez l'Arborescence des Fichiers
            </h4>

            <div class="intro-card">
              <p>Imaginez votre ordinateur comme une bibliothèque parfaitement organisée. L'arborescence des fichiers est votre guide numérique pour tout retrouver facilement ! 🚀</p>
            </div>

            <div class="feature-grid">
              <div class="feature-card">
                <h5><font-awesome-icon icon="folder" /> Structure de Base</h5>
                <ul>
                  <li><span class="highlight">Dossiers racines</span> - Vos points de départ ("Documents", "Images")</li>
                  <li><span class="highlight">Sous-dossiers</span> - Créez des catégories selon vos besoins</li>
                  <li><span class="highlight">Fichiers</span> - Vos documents, photos et autres contenus</li>
                </ul>
              </div>

              <div class="feature-card">
                <h5><font-awesome-icon icon="code" /> Navigation Intuitive</h5>
                <ul>
                  <li>💡 Un clic pour explorer les dossiers</li>
                  <li>↕️ Flèches pour développer/réduire</li>
                  <li>🧭 Suivez votre chemin en haut</li>
                </ul>
              </div>

              <div class="feature-card">
                <h5><font-awesome-icon icon="star" /> Avantages Clés</h5>
                <ul>
                  <li>🎯 Retrouvez vos fichiers en quelques clics</li>
                  <li>✨ Une organisation claire et efficace</li>
                  <li>🎨 Une structure adaptée à vos besoins</li>
                </ul>
              </div>
            </div>
          </div>
        </file-explorer>
      </div>

      <!-- Vue Exercices -->
      <div v-else class="exercises-container fade">
        <h2 class="exercises-title">Exercices sur l'arborescence des fichiers</h2>
        <div class="exercises-grid">
          <div 
            v-for="(exercise, index) in exercises" 
            :key="index"
            class="exercise-card"
            @click="selectExercise(exercise)"
          >
            <div class="card-icon">
              <font-awesome-icon :icon="exercise.icon" />
            </div>
            <h3>{{ exercise.title }}</h3>
            <p>{{ exercise.description }}</p>
            <div class="difficulty">
              Difficulté: 
              <span :class="exercise.difficulty">{{ exercise.difficulty }}</span>
            </div>
          </div>
        </div>
        <component :is="currentExerciseComponent" :exercise="selectedExercise" v-if="selectedExercise" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import FileExplorer from '@/components/FileExplorer.vue'
import ExerciseTypeA from '@/components/ExerciseTypeA.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFolder, faFolderTree, faFile, faHome, faFolderOpen, faChevronRight, faChevronDown, faCompass, faFolderPlus, faSort, faSearch, faLock, faProjectDiagram, faDesktop, faCode, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import exercisesData from '@/data/exercises.json'

library.add(faFolder, faFolderTree, faFile, faHome, faFolderOpen, faChevronRight, faChevronDown, faCompass, faFolderPlus, faSort, faSearch, faLock, faProjectDiagram, faDesktop, faCode, faStar)

export default defineComponent({
  name: 'FileTreeView',
  components: {
    FileExplorer,
    FontAwesomeIcon
  },
  data() {
    return {
      currentView: 'demo',
      selectedExercise: null,
      fileTree: [
        {
          name: 'Documents',
          type: 'folder',
          children: [
            { name: 'Attestation.pdf', type: 'file', content: 'Contenu de l\'attestation de scolarité' },
            { name: 'Repas du jour.pdf', type: 'file', content: 'Contenu du repas du jour' },
            {
              name: 'Photos',
              type: 'folder',
              children: [
                { name: 'Reception.jpg', type: 'file', content: 'Contenu de la photo de la réception' }
              ]
            }
          ]
        },
        { name: 'logo.png', type: 'file', content: 'Contenu du logo' }
      ],
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
/* Styles pour le conteneur principal et la navigation */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.navigation-buttons {
  display: flex;
  gap: 10px;
  margin-top: 11vh;
  z-index: 100;
  justify-content: center;
  width: 100%;
}

.nav-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s ease;
  background-color: var(--switch-buttob-bg);
  color: var(--text-color);
}

.nav-button:hover {
  background-color: var(--accent-color);
  transform: translateY(-2px);
}

.nav-button.active {
  background-color: var(--accent-color);
  box-shadow: 0 2px 4px var(--shadow-color);
}

/* Styles pour la section des exercices */
.exercises-container {
  width: 60vw;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.exercises-title {
  text-align: center;
  color: var(--text-color);
  margin: 0;
}

.exercises-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  width: 100%;
}

.exercise-card {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.exercise-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px var(--shadow-color);
  border-color: var(--accent-color);
}

.exercise-card h3 {
  color: var(--accent-color);
  margin: 0;
  font-size: 1.2em;
}

.exercise-card p {
  color: var(--text-color);
  margin: 0;
  font-size: 0.9em;
}

.difficulty {
  font-size: 0.8em;
  color: var(--text-secondary);
}

.card-icon {
  font-size: 2em;
  color: var(--accent-color);
  align-self: center;
}

/* Styles pour l'explication du système de fichiers */
.file-system-explanation {
  color: var(--text-color);
  padding: 20px;
}

.modern-title {
  color: var(--accent-color);
  margin-bottom: 20px;
  margin-top: 0;
}

.title-icon {
  margin-right: 10px;
}

.intro-card {
  background-color: var(--bg-secondary);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.feature-card {
  background-color: var(--bg-secondary);
  padding: 20px;
  border-radius: 8px;
}

.feature-card h5 {
  color: var(--accent-color);
  margin-bottom: 15px;
}

.highlight {
  color: var(--accent-color);
  font-weight: bold;
}

/* Styles pour le message mobile */
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

/* Media queries */
@media (max-width: 1024px) {
  .desktop-content {
    display: none;
  }

  .mobile-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

/* Animations */
.fade {
  animation: fade 0.3s ease-in-out;
}

@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.demo-container {
  width: 60vw;
  height: 70vh;
  position: relative;
  margin-top: 50px;
}
</style>