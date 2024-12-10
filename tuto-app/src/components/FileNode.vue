<template>
  <li :class="['file-node', { 'is-folder': isFolder }]">
    <div 
      class="node-content" 
      @click="toggle"
      @contextmenu.prevent="showContextMenu"
      :class="{ 'selected': isSelected }"
    >
      <span class="icon">
        <font-awesome-icon 
          v-if="isFolder" 
          :icon="isOpen ? 'folder-open' : 'folder'"
          class="folder-icon" 
        />
        <font-awesome-icon 
          v-else 
          icon="file"
          class="file-icon" 
        />
      </span>
      <span class="node-name">{{ node.name }}</span>
      <font-awesome-icon 
        v-if="isFolder" 
        :icon="isOpen ? 'chevron-down' : 'chevron-right'"
        class="chevron-icon" 
      />
    </div>
    
    <div v-if="showMenu" 
         class="context-menu"
         :style="{ top: menuY + 'px', left: menuX + 'px' }"
         @blur="closeMenu"
         tabindex="-1"
         ref="contextMenu">
      <ul>
        <li v-if="isFolder" @click="addNewItem('file')">Nouveau fichier</li>
        <li v-if="isFolder" @click="addNewItem('folder')">Nouveau dossier</li>
        <li @click="renameItem">Renommer</li>
        <li @click="deleteItem">Supprimer</li>
      </ul>
    </div>

    <transition name="slide-fade">
      <ul v-if="isOpen && node.children" class="node-children">
        <file-node 
          v-for="child in node.children" 
          :key="child.name" 
          :node="child"
          @select="onChildSelect"
        />
      </ul>
    </transition>
  </li>
</template>

<script>
export default {
  name: 'FileNode',
  props: {
    node: Object
  },
  data() {
    return {
      isOpen: false,
      isSelected: false,
      showMenu: false,
      menuX: 0,
      menuY: 0
    }
  },
  computed: {
    isFolder() {
      return this.node.type === 'folder'
    }
  },
  methods: {
    toggle() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen
      } else {
        this.select()
      }
    },
    select() {
      this.isSelected = true
      this.$emit('select', this.node)
    },
    onChildSelect(node) {
      this.$emit('select', node)
    },
    showContextMenu(event) {
      event.preventDefault()
      this.menuX = event.clientX
      this.menuY = event.clientY
      this.showMenu = true
      this.$nextTick(() => {
        this.$refs.contextMenu?.focus()
      })
    },
    closeMenu() {
      this.showMenu = false
    },
    addNewItem(type) {
      const newName = type === 'file' ? 'Nouveau fichier' : 'Nouveau dossier'
      const newNode = {
        name: newName,
        type: type,
        children: type === 'folder' ? [] : undefined
      }
      this.$emit('add-node', this.node, newNode)
      this.closeMenu()
    },
    renameItem() {
      const newName = prompt('Nouveau nom:', this.node.name)
      if (newName) {
        this.$emit('rename-node', this.node, newName)
      }
      this.closeMenu()
    },
    deleteItem() {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
        this.$emit('delete-node', this.node)
      }
      this.closeMenu()
    }
  },
  mounted() {
    document.addEventListener('click', (e) => {
      if (this.showMenu && !this.$el.contains(e.target)) {
        this.closeMenu()
      }
    })
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeMenu)
  }
}
</script>

<style scoped>
.file-node {
  list-style: none;
  margin: 2px 0;
}

.node-content {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.node-content:hover {
  background-color: #2a2d2e;
}

.node-content.selected {
  background-color: #37373d;
}

.icon {
  margin-right: 8px;
  width: 16px;
  text-align: center;
}

.folder-icon {
  color: #dcb67a;
}

.file-icon {
  color: #8fbcbb;
}

.chevron-icon {
  margin-left: auto;
  font-size: 0.8em;
  color: #6c6c6c;
}

.node-name {
  font-size: 0.9em;
}

.node-children {
  padding-left: 20px;
}

/* Animations */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}

/* Style pour les dossiers */
.is-folder > .node-content:hover {
  background-color: var(--file-hover);
}

/* Style pour les fichiers */
.file-node:not(.is-folder) > .node-content:hover {
  background-color: var(--file-hover);
}

.context-menu {
  position: fixed;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 5px 0;
  min-width: 150px;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.context-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.context-menu li {
  padding: 8px 15px;
  cursor: pointer;
  font-size: 0.9em;
}

.context-menu li:hover {
  background-color: var(--accent-color);
  color: white;
}
</style>