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
          <template v-if="currentPath">/ {{ currentPath }}</template>
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
      const parent = this.findParent(node, this.localFileTree);
      if (parent && parent.children) {
        const index = parent.children.indexOf(node);
        if (index > -1) {
          parent.children.splice(index, 1);
        }
      } else {
        const index = this.localFileTree.indexOf(node);
        if (index > -1) {
          this.localFileTree.splice(index, 1);
        }
      }
      if (this.selectedFile === node) {
        this.selectedFile = null;
        this.currentPath = '';
      }
      console.log("Arborescence après suppression:", this.localFileTree);
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
      this.selectedFile = payload.node
      this.currentPath = payload.path
      this.$emit('select', payload)
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
  height: 60vh;
  width: 100%;
  background-color: var(--bg-primary);
  color: var(--text-color);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px var(--shadow-color);
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
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
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

@media (max-width: 768px) {
  .file-explorer {
    flex-direction: column;
    height: calc(90vh - 140px);
  }

  .sidebar {
    width: 100% !important;
    height: 250px;
    overflow-y: hidden;
  }

  .content-area {
    height: calc(100% - 250px);
  }

  .resizer {
    display: none;
  }
}

@media (max-width: 480px) {
  .file-explorer {
    height: calc(90vh - 140px);
  }

  .sidebar {
    height: 200px;
  }

  .content-area {
    height: calc(100% - 200px);
  }

  .breadcrumb {
    font-size: 0.8em;
  }
}
</style>
