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
      <span v-if="!isEditing" class="node-name">{{ node.name }}</span>
      <input
        v-else
        v-model="editedName"
        @blur="finishEditing"
        @keyup.enter="finishEditing"
        @keyup.esc="cancelEditing"
        ref="nameInput"
        class="name-input"
      />
      <font-awesome-icon 
        v-if="isFolder" 
        :icon="isOpen ? 'chevron-down' : 'chevron-right'"
        class="chevron-icon" 
      />
    </div>
    <context-menu
      :show="showMenu"
      :position="menuPosition"
      :is-folder="isFolder"
      @action="handleContextMenuAction"
      @close="closeContextMenu"
    />
    <transition name="slide-fade">
      <ul v-if="isOpen && node.children" class="node-children">
        <file-node 
          v-for="child in node.children" 
          :key="child.name" 
          :node="child"
          @select="onChildSelect"
          @add-node="(parentNode, newNode) => $emit('add-node', parentNode, newNode)"
          @rename-node="(node, newName) => $emit('rename-node', node, newName)"
          @delete-node="(node) => $emit('delete-node', node)"
        />
      </ul>
    </transition>
  </li>
</template>

<script>
import ContextMenu from './ContextMenu.vue'

export default {
  name: 'FileNode',
  components: {
    ContextMenu
  },
  props: {
    node: Object
  },
  data() {
    return {
      isOpen: false,
      isSelected: false,
      showMenu: false,
      menuPosition: { x: 0, y: 0 },
      isEditing: false,
      editedName: ''
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

    closeContextMenu() {
      this.showMenu = false
    },
    
    showContextMenu(event) {
      this.menuPosition = { x: event.clientX, y: event.clientY }
      this.showMenu = true
      event.stopPropagation()
      
      const closeHandler = () => {
        this.closeContextMenu()
        window.removeEventListener('click', closeHandler)
      }
      window.addEventListener('click', closeHandler)
    },
    
    handleContextMenuAction(action) {
      switch (action) {
        case 'newFile':
          this.createNew('file')
          break
        case 'newFolder':
          this.createNew('folder')
          break
        case 'rename':
          this.startEditing()
          break
        case 'delete':
          this.deleteNode()
          break
      }
      this.showMenu = false
    },
    
    createNew(type) {
      const newName = type === 'folder' ? 'Nouveau dossier' : 'Nouveau fichier'
      const newNode = {
        name: newName,
        type: type,
        children: type === 'folder' ? [] : undefined
      }
      this.$emit('add-node', this.node, newNode)
      this.isOpen = true
    },
    
    startEditing() {
      this.editedName = this.node.name
      this.isEditing = true
      this.$nextTick(() => {
        this.$refs.nameInput.focus()
      })
    },
    
    finishEditing() {
      if (this.editedName.trim()) {
        this.$emit('rename-node', this.node, this.editedName.trim())
      }
      this.isEditing = false
    },
    
    cancelEditing() {
      this.isEditing = false
    },
    
    deleteNode() {
      this.$emit('delete-node', this.node)
    }
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

.name-input {
  background: #3c3c3c;
  border: 1px solid #525252;
  color: #e1e1e1;
  padding: 2px 6px;
  border-radius: 3px;
  outline: none;
  font-size: 0.9em;
}

.name-input:focus {
  border-color: #007acc;
}

/* Animations */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}
</style>