<template>
  <div class="file-explorer">
    <div class="sidebar" ref="sidebar">
      <div class="sidebar-header">
        <h2><font-awesome-icon icon="folder" /> Explorateur</h2>
      </div>
      <div class="tree-container">
        <ul class="file-tree">
          <file-node 
            v-for="node in localFileTree" 
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
          <template v-if="currentPath">{{ currentPath }}</template>
        </div>
      </div>
      <div class="selected-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import FileNode from './FileNode.vue'

export default defineComponent({
  name: 'FileExplorer',
  components: {
    FileNode
  },
  props: {
    fileTree: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      localFileTree: JSON.parse(JSON.stringify(this.fileTree)),
      selectedFile: null,
      currentPath: '',
      isResizing: false,
      startWidth: 0,
      startX: 0
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
    console.log('Nom actuel du nœud:', node.name);
    console.log('Nouveau nom proposé:', newName);

    if (node && newName && node.name !== newName) {
      const oldName = node.name;
      node.name = newName;
      
      if (this.selectedFile === node) {
        this.currentPath = this.currentPath.replace(oldName, newName);
        console.log("Renommage réussi du nœud:", oldName, "à", newName);
      }
    } else {
      console.log("Le nom n'a pas changé ou est invalide.");
    }
  },
    
    deleteNode(node) {
      console.log('Début de la suppression du nœud:', node);
      console.log('État initial de l\'arborescence:', JSON.stringify(this.localFileTree));

      const parent = this.findParent(node, this.localFileTree);
      console.log('Parent trouvé:', parent);

      if (parent && parent.children) {
        console.log('Suppression depuis le parent');
        const index = parent.children.indexOf(node);
        console.log('Index du nœud dans les enfants:', index);
        if (index > -1) {
          parent.children.splice(index, 1);
          console.log('Nœud supprimé des enfants du parent');
        }
      } else {
        console.log('Suppression depuis la racine');
        const index = this.localFileTree.indexOf(node);
        console.log('Index du nœud dans l\'arborescence racine:', index);
        if (index > -1) {
          this.localFileTree.splice(index, 1);
          console.log('Nœud supprimé de la racine');
        }
      }

      if (this.selectedFile === node) {
        console.log('Le nœud supprimé était sélectionné, réinitialisation de la sélection');
        this.selectedFile = null;
        this.currentPath = '';
      }

      this.$forceUpdate();
      console.log('État final de l\'arborescence:', JSON.stringify(this.localFileTree));
    },
    
    findParent(node, tree = this.localFileTree) {
      for (const item of tree) {
        if (item.children && item.children.includes(node)) {
          return item;
        }
        if (item.children) {
          const parent = this.findParent(node, item.children);
          if (parent) return parent;
        }
      }
      return null;
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
      this.selectedFile = payload.node;
      const basePath = 'C:/';
      this.currentPath = payload.path ? `${basePath}${payload.path}` : basePath;
      this.$emit('select', payload);
    }
  },
  beforeUnmount() {
    document.removeEventListener('mousemove', this.resize);
    document.removeEventListener('mouseup', this.stopResize);
  }
})
</script>

<style scoped>
.file-explorer {
  display: flex;
  height: min(70vh, 800px);
  width: 100%;
  background-color: var(--bg-primary);
  color: var(--text-color);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 16px var(--shadow-color);
}

.sidebar {
  width: clamp(200px, 25vw, 200px);
  max-width: 500px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  position: relative;
  flex-shrink: 0;
}

.sidebar-header {
  padding: clamp(0.8rem, 2vw, 1.2rem);
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  height: clamp(30px, 5vh, 40px);
  display: flex;
  align-items: center;
}

.sidebar-header h2 {
  margin: 0;
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 1vw, 0.8rem);
  color: var(--text-color);
}

.tree-container {
  padding: clamp(0.8rem, 2vw, 1.2rem);
  overflow-y: auto;
  height: calc(100% - clamp(30px, 5vh, 40px));
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-header {
  padding: clamp(0.8rem, 2vw, 1.2rem);
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  height: clamp(30px, 5vh, 40px);
  display: flex;
  align-items: center;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 1vw, 0.8rem);
  color: var(--text-secondary);
  font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  user-select: none;
}

.selected-content {
  padding: clamp(0.8rem, 2vw, 1.2rem);
  flex: 1;
  overflow-y: auto;
  background-color: var(--bg-primary);
  user-select: none;
}

.file-tree {
  padding: 0;
  margin: 0;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.resizer {
  width: clamp(8px, 1vw, 12px);
  height: 100%;
  position: absolute;
  right: calc(clamp(8px, 1vw, 12px) / -2);
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

@media (max-width: 768px) {
  .file-explorer {
    flex-direction: column;
    height: calc(90vh - clamp(80px, 10vh, 140px));
  }

  .sidebar {
    width: 100% !important;
    height: clamp(200px, 30vh, 250px);
    overflow-y: hidden;
  }

  .content-area {
    height: calc(100% - clamp(200px, 30vh, 250px));
  }

  .resizer {
    display: none;
  }
}

@media (max-width: 480px) {
  .file-explorer {
    height: calc(90vh - clamp(80px, 10vh, 140px));
  }

  .sidebar {
    height: clamp(180px, 25vh, 200px);
  }

  .content-area {
    height: calc(100% - clamp(180px, 25vh, 200px));
  }

  .breadcrumb {
    font-size: clamp(0.7rem, 1vw, 0.8rem);
  }
}
</style>
