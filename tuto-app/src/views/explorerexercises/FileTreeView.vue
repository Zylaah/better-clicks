<template>
  <div class="container">
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
/* Base styles */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
}

.file-explorer {
  height: 100%;
}

/* Navigation buttons */
.navigation-buttons {
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-top: max(12vh, 7rem);
  z-index: 100;
  justify-content: center;
  width: 100%;
}

.nav-button {
  padding: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: clamp(0.9rem, 1.5vw, 1rem);
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

/* Demo Container */
.demo-container {
  width: min(95%, 70vw);
  height: calc(75vh - clamp(2rem, 5vh, 4rem));
  border-radius: 10px;
  position: relative;
  margin: clamp(1rem, 5vh, 2rem) auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: auto;
  box-shadow: 0 2px 4px var(--shadow-color);
}

/* File System Explanation */
.file-system-explanation {
  color: var(--text-color);
  padding: clamp(.7rem, 2vw, 1rem);
}

.modern-title {
  color: var(--accent-color);
  margin-bottom: clamp(1rem, 2vw, 2rem);
  margin-top: 0;
}

.title-icon {
  margin-right: 10px;
}

.intro-card {
  background-color: var(--bg-secondary);
  padding: clamp(1rem, 2vw, 2rem);
  border-radius: 8px;
  margin-bottom: clamp(1.5rem, 3vw, 3rem);
  flex-shrink: 0;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: clamp(1rem, 2vw, 2rem);
  padding-bottom: 1rem;
}

.feature-card {
  min-height: fit-content;
  height: auto;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  padding: clamp(0.5rem, 2vw, 1rem);
}

.feature-card h5 {
  color: var(--accent-color);
  margin-bottom: clamp(0.75rem, 1.5vw, 1rem);
  margin-top: 0;
}

.highlight {
  color: var(--accent-color);
  font-weight: bold;
}

/* Exercises Container */
.exercises-container {
  width: min(95%, 60vw);
  padding: clamp(1rem, 4vh, 2rem) clamp(1rem, 3vw, 3rem) clamp(2rem, 4vw, 4rem) clamp(1rem, 3vw, 3rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
}

.exercises-title {
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  margin-bottom: clamp(0.2rem, 3vw, 1rem);
  margin-top: 0;
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

/* Responsive Design */
@media (max-width: 768px) {
  .card {
    min-height: 200px;
    padding: 1.2rem;
  }

  .card_body {
    bottom: 1.2rem;
    right: 1.2rem;
  }

  .card span {
    bottom: 1.2rem;
    left: 1.2rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .exercises-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Dark Mode Adjustments */
@media (prefers-color-scheme: dark) {
  .card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }

  .card:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  }

  .card_body p {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

@media (max-width: 1180px) {
  .desktop-content {
    display: none;
  }
}


/* Media Queries */
@media screen and (max-width: 1366px) {
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .exercises-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .exercises-grid {
    grid-template-columns: 1fr;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }
}


@media (max-height: 768px) {

  .card > strong {
    font-size: 1.2rem;
  }

  .card {
    min-height: 180px;
  }

  .demo-container {
    margin-top: 1rem;
  }

  .exercises-container {
    padding: 0 0 1rem 0;
  }

  .exercises-title {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
}

/* Animation */
.fade {
  animation: fade 0.3s ease-in-out;
}

@keyframes fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Optimisation des performances */
@media (prefers-reduced-motion: reduce) {
  .fade {
    animation: none;
  }
  
  .nav-button {
    transition: none;
  }
}
</style>