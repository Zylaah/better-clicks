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
      <div v-if="currentView === 'demo'" class="file-explorer fade">
        <div class="sidebar" ref="sidebar">
          <div class="sidebar-header">
            <h2><font-awesome-icon icon="folder" /> Explorateur</h2>
          </div>
          <div class="tree-container">
            <ul class="file-tree">
              <file-node 
                v-for="node in fileTree" 
                :key="node.id" 
                :node="node"
                :parent-path="''"
                :selected-node="selectedFile"
                @select="handleSelect"
                @add-node="addNode" 
                @rename-node="renameNode" 
                @delete-node="deleteNode" 
              />
            </ul>
          </div>
          <div 
            class="resizer" 
            @mousedown="startResize"
            @mouseover="showResizeCursor"
            @mouseleave="hideResizeCursor"
          ></div>
        </div>
        <div class="content-area">
          <div class="content-header">
            <div class="breadcrumb">
              <font-awesome-icon icon="home" /> 
              <template v-if="currentPath">/ {{ currentPath }}</template>
            </div>
          </div>
          <div class="selected-content">
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
          </div>
        </div>
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
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import FileNode from '@/components/FileNode.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFolder, faFile, faHome, faFolderOpen, faChevronRight, faChevronDown, faCompass, faFolderPlus, faSort, faSearch, faLock, faProjectDiagram, faDesktop } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faFolder, faFile, faHome, faFolderOpen, faChevronRight, faChevronDown, faCompass, faFolderPlus, faSort, faSearch, faLock, faProjectDiagram, faDesktop)

export default defineComponent({
  name: 'FileTreeView',
  components: {
    FileNode,
    FontAwesomeIcon
  },
  data() {
    return {
      selectedFile: null,
      currentPath: '',
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
      isResizing: false,
      startWidth: 0,
      startX: 0,
      currentView: 'demo',
      exercises: [
        {
          title: "Navigation de Base",
          description: "Apprenez à naviguer dans une arborescence simple de fichiers",
          difficulty: "Facile",
          icon: "compass",
        },
        {
          title: "Création de Structure",
          description: "Créez une structure de fichiers selon un schéma donné",
          difficulty: "Facile",
          icon: "folder-plus",
        },
        {
          title: "Réorganisation",
          description: "Réorganisez une structure de fichiers désordonnée",
          difficulty: "Moyen",
          icon: "sort",
        },
        {
          title: "Recherche de Fichiers",
          description: "Retrouvez des fichiers spécifiques dans une structure complexe",
          difficulty: "Moyen",
          icon: "search",
        },
        {
          title: "Gestion des Permissions",
          description: "Gérez les droits d'accès des fichiers et dossiers",
          difficulty: "Difficile",
          icon: "lock",
        },
        {
          title: "Structure Avancée",
          description: "Créez une structure complexe avec des liens symboliques",
          difficulty: "Difficile",
          icon: "project-diagram",
        }
      ]
    }
  },
  methods: {
    addNode({ parent, newNode }) {
      if (parent && parent.type === 'folder') {
        if (!parent.children) {
          parent.children = []
        }
        newNode.id = Date.now()
        parent.children.push(newNode)
      }
    },
    
    renameNode({ node, newName }) {
      if (node) {
        const oldName = node.name
        node.name = newName
        
        if (this.selectedFile === node) {
          this.currentPath = this.currentPath.replace(oldName, newName)
        }
      }
    },
    
    deleteNode(node) {
      const parent = this.findParent(node)
      if (parent && parent.children) {
        const index = parent.children.indexOf(node)
        if (index > -1) {
          parent.children.splice(index, 1)
        }
      }
    },
    
    findParent(node, tree = this.fileTree) {
      for (const item of tree) {
        if (item.children && item.children.includes(node)) {
          return item
        }
        if (item.children) {
          const parent = this.findParent(node, item.children)
          if (parent) return parent
        }
      }
      return null
    },
    
    startResize(event) {
      this.isResizing = true
      this.startX = event.clientX
      this.startWidth = this.$refs.sidebar.offsetWidth
      
      document.addEventListener('mousemove', this.resize)
      document.addEventListener('mouseup', this.stopResize)
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    },
    
    resize(event) {
      if (!this.isResizing) return
      
      const sidebar = this.$refs.sidebar
      const newWidth = this.startWidth + (event.clientX - this.startX)
      
      if (newWidth >= 200 && newWidth <= 600) {
        sidebar.style.width = `${newWidth}px`
      }
    },
    
    stopResize() {
      this.isResizing = false
      document.removeEventListener('mousemove', this.resize)
      document.removeEventListener('mouseup', this.stopResize)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    },

    showResizeCursor() {
      document.body.style.cursor = 'ew-resize'
    },

    hideResizeCursor() {
      if (!this.isResizing) {
        document.body.style.cursor = ''
      }
    },
    
    handleSelect(payload) {
      console.log('FileTreeView - handleSelect:', payload)
      this.selectedFile = payload.node
      this.currentPath = payload.path
    },
    selectExercise(exercise) {
      console.log('Exercice sélectionné:', exercise.title)
    }
  },
  beforeUnmount() {
    document.removeEventListener('mousemove', this.resize);
    document.removeEventListener('mouseup', this.stopResize);
  }
})
</script>

<style scoped>
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
}

.exercise-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px var(--shadow-color);
  border-color: var(--accent-color);
}

.card-icon {
  font-size: 1.5em;
  color: var(--accent-color);
  margin-bottom: 8px;
}

.exercise-card h3 {
  color: var(--text-color);
  margin: 0;
  font-size: 1.1em;
}

.exercise-card p {
  color: var(--text-secondary);
  margin: 0;
  flex-grow: 1;
  font-size: 0.9em;
}

.difficulty {
  font-size: 0.9em;
  color: var(--text-secondary);
}

.difficulty span {
  font-weight: bold;
}

.difficulty span.Facile {
  color: #4CAF50;
}

.difficulty span.Moyen {
  color: #FFC107;
}

.difficulty span.Difficile {
  color: #f44336;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
    gap: 10px;
  }

  .navigation-buttons {
    margin-top: 15vh;
    width: 100%;
    justify-content: center;
    gap: 5px;
  }

  .nav-button {
    padding: 8px 15px;
    font-size: 0.9em;
    flex: 1;
    max-width: 150px;
  }

  .file-explorer {
    width: 95vw;
    height: 70vh;
    margin-top: 10px;
  }

  .exercises-container {
    width: 95vw;
    padding: 15px;
  }

  .exercises-grid {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 10px;
  }

  .exercise-card {
    padding: 15px;
  }

  .exercises-title {
    font-size: 1.2em;
    margin-bottom: 20px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .exercises-container {
    width: 80vw;
  }

  .exercises-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .file-explorer {
    width: 80vw;
  }
}

/* Ajustement du style existant */
.file-explorer {
  margin-top: 20px;
  display: flex;
  height: 60vh;
  width:60vw;
  max-width: none;
  background-color: var(--bg-primary);
  color: var(--text-color);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px var(--shadow-color);
  /* Centrage */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.sidebar {
  width: 200px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  position: relative;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 15px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  height: 30px;
  display: flex;
  align-items: center;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.1em;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-color);
}

.tree-container {
  padding: 15px;
  overflow-y: auto;
  height: calc(100% - 60px);
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-header {
  padding: 15px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  height: 30px;
  display: flex;
  align-items: center;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 0.9em;
  user-select: none;
  -webkit-user-select: none; 
  -moz-user-select: none; 
  -ms-user-select: none;
}

.selected-content {
  padding: 15px;
  flex: 1;
  overflow-y: auto;
  background-color: var(--bg-primary);
  /* Ajout de la propriété pour empêcher la sélection */
  user-select: none;
  -webkit-user-select: none; /* Pour Safari */
  -moz-user-select: none; /* Pour Firefox */
  -ms-user-select: none; /* Pour IE/Edge */
}

.file-tree {
  padding: 0;
  margin: 0;
}

.file-system-explanation {
  color: var(--text-color);
}

.modern-title {
  color: var(--accent-color);
}

.title-icon {
  color: var(--accent-color);
}

.intro-card {
  background-color: var(--bg-primary);
}

.feature-card {
  background-color: var(--bg-primary);
}

.feature-card h5 {
  color: var(--accent-color);
}

.feature-card ul li {
  color: var(--text-secondary);
}

.highlight {
  color: var(--accent-color);
}

.resizer {
  width: 12px;
  height: 100%;
  position: absolute;
  right: -6px;
  top: 0;
  cursor: ew-resize;
  background: transparent;
  z-index: 10;
}

.resizer:hover::after,
.resizer.resizing::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: var(--accent-color);
  transform: translateX(-50%);
  transition: background-color 0.2s;
}

.resizer:hover::after {
  background-color: var(--accent-color);
}

@media (max-width: 1200px) {
  .file-explorer {
    height: calc(80vh - 160px);
  }
  /* Masquer le resizer en mode responsive */
  .resizer {
    display: none;
  }
}

@media (max-width: 768px) {
  .file-explorer {
    flex-direction: column;
    height: calc(90vh - 140px);
    width: 95vw;
    position: relative;
    top: 0;
    left: 0;
    transform: none;
    margin: 10px auto;
    overflow: hidden;
  }

  .sidebar {
    width: 100% !important;
    height: 250px;
    overflow-y: hidden;
  }

  .content-area {
    height: calc(100% - 250px);
    overflow: hidden;
  }

  .selected-content {
    padding: 15px;
    min-height: 400px;
    height: 100%;
    overflow-y: auto;
  }

  .tree-container {
    height: calc(100% - 60px);
    overflow-y: auto;
  }

  .content-header {
    padding: 10px;
    height: auto;
  }

  .file-system-explanation {
    font-size: 1em;
  }

  .feature-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .feature-card {
    padding: 20px;
    margin-bottom: 15px;
  }

  .modern-title {
    font-size: 1.3em;
    margin-bottom: 15px;
  }

  .intro-card {
    margin-bottom: 20px;
    font-size: 1.1em;
  }

  .feature-card h5 {
    font-size: 1.2em;
    margin-bottom: 10px;
  }

  .feature-card ul li {
    font-size: 1em;
    margin-bottom: 8px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .file-explorer {
    width: 80vw;
    height: 70vh;
    position: relative;
    top: 0;
    left: 0;
    transform: none;
    margin: 20px auto;
  }

  .sidebar {
    width: 250px !important;
  }

  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
}

/* Ajustements pour les très petits écrans */
@media (max-width: 480px) {
  .file-explorer {
    height: calc(90vh - 140px);
  }

  .sidebar {
    height: 250px;
  }

  .content-area {
    height: calc(100% - 250px);
  }

  .node-name {
    max-width: 120px;
  }

  .breadcrumb {
    font-size: 0.8em;
  }
}

/* Animation de transition entre les vues */
.file-explorer, .exercises-container {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Remplacer l'animation existante par un simple fade */
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

/* Style pour le message mobile */
.mobile-message {
  display: none;
  text-align: center;
  padding: 30px;
  margin: 20px;
  background: var(--bg-secondary);
  border-radius: 10px;
  box-shadow: 0 2px 4px var(--shadow-color);
  /* Centrage absolu */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 400px;
}

.desktop-icon {
  font-size: 3em;
  color: var(--accent-color);
  margin-bottom: 20px;
}

.mobile-message h2 {
  color: var(--text-color);
  margin: 0 0 15px 0;
}

.mobile-message p {
  color: var(--text-secondary);
  line-height: 1.5;
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

/* Ajustement pour les très petits écrans */
@media (max-width: 480px) {
  .mobile-message {
    width: 90%;
    padding: 20px;
    margin: 10px;
  }
}

/* Garder les styles desktop uniquement pour les grands écrans */
@media (min-width: 1025px) {
  .mobile-message {
    display: none;
  }
}
</style>