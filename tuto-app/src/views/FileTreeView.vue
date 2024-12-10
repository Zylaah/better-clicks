<template>
  <div class="file-explorer">
    <div class="sidebar">
      <div class="sidebar-header">
        <h2><font-awesome-icon icon="folder" /> Explorateur</h2>
      </div>
      <div class="tree-container">
        <ul class="file-tree">
          <file-node v-for="node in fileTree" :key="node.id" :node="node" @add-node="addNode" @rename-node="renameNode" @delete-node="deleteNode" />
        </ul>
      </div>
    </div>
    <div class="content-area">
      <div class="content-header">
        <div class="breadcrumb">
          <font-awesome-icon icon="home" /> / {{ currentPath }}
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
      currentPath: 'root',
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
        node.name = newName
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
    }
  }
})
</script>

<style scoped>
.file-explorer {
  display: flex;
  height: calc(100vh - 100px);
  max-width: 1200px;
  margin: 20px auto;
  background-color: var(--bg-primary);
  color: var(--text-color);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px var(--shadow-color);
}

.sidebar {
  width: 300px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
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
}

.selected-content {
  padding: 15px;
  flex: 1;
  overflow-y: auto;
  background-color: var(--bg-primary);
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

@media (max-width: 1200px) {
  .file-explorer {
    margin: 20px;
    height: calc(100vh - 160px);
  }
}

@media (max-width: 768px) {
  .file-explorer {
    flex-direction: column;
    height: calc(100vh - 140px);
  }

  .sidebar {
    width: 100%;
    height: 300px;
  }

  .content-area {
    height: calc(100% - 300px);
  }
}
</style>