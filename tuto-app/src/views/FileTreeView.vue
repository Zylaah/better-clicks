<template>
  <div class="container">
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
            class="card"
            @click="selectExercise(exercise)"
          >
            <div class="card-icon">
              <font-awesome-icon :icon="exercise.icon" />
            </div>
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
  overflow: auto;
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
  position: relative;
  margin: clamp(1rem, 5vh, 2rem) auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: auto;
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
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  --bg: #f7f7f8;
  --hover-bg: #ebfde9;
  --hover-text: var(--accent-color);
  background: var(--bg-secondary);
  max-width: 30ch;
  max-height: 25ch;
  text-align: center;
  padding: 1.5em;
  padding-block: 1.8em;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  transition: .3s cubic-bezier(.6,.4,0,1),transform .15s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 4px var(--shadow-color);
  align-items: center;
  gap: 1rem;
}

.card_body {
  color: #464853;
  line-height: 1.5em;
  font-size: 1em;
}

.card_body p {
  background: var(--accent-color);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.card > :not(span) {
  transition: .3s cubic-bezier(.6,.4,0,1);
}

.card > strong {
  display: block;
  font-size: 1.4rem;
  letter-spacing: -.035em;
  color: var(--text-color);
}

.card span {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--hover-text);
  border-radius: 5px;
  font-weight: bold;
  top: 100%;
  transition: all .3s cubic-bezier(.6,.4,0,1);
}

.card:hover span {
  top: 0;
  font-size: 1.2em;
}

.card:hover {
  background: var(--hover-bg);
  cursor: pointer;
}

.card:hover>div,.card:hover>strong {
  opacity: 0;
}

.card-icon {
  font-size: 2em;
  color: var(--accent-color);
  align-self: center;
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

@media (max-height: 835px) {
  .container {
    scale: 0.9;
  }

  .exercises-container {
    padding-bottom: 0;
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