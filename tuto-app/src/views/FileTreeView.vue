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
      <h2>Exercices sur l'arborescence des fichiers</h2>
      <!-- Ajoutez ici le contenu des exercices -->
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import FileNode from '@/components/FileNode.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFolder, faFile, faHome, faFolderOpen, faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faFolder, faFile, faHome, faFolderOpen, faChevronRight, faChevronDown)

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
  gap: 20px;
  padding: 20px;
}

.navigation-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  z-index: 100;
  margin-top: 15vh;
  transform: translateY(-50%);
}

.nav-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s ease;
  background-color: var(--bg-secondary);
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
  background-color: var(--bg-primary);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px var(--shadow-color);
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
    height: calc(80vh - 140px);
  }

  .sidebar {
    width: 100% !important; /* Force la largeur à 100% */
    height: 300px;
  }

  .content-area {
    height: calc(100% - 300px);
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
</style>