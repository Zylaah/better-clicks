<template>
  <li :class="['file-node', { 'is-folder': isFolder }]">
    <div 
      class="node-content" 
      @click="toggle"
      @contextmenu.prevent="onContextMenu"
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
      
      <span v-if="!isEditing" class="node-name" @dblclick="startRename">
        {{ node.name }}
      </span>
      <input
        v-else
        ref="nameInput"
        v-model="editedName"
        class="name-input"
        @blur="confirmRename"
        @keyup.enter="confirmRename"
        @keyup.esc="cancelRename"
      />

      <font-awesome-icon 
        v-if="isFolder" 
        :icon="isOpen ? 'chevron-down' : 'chevron-right'"
        class="chevron-icon" 
      />
    </div>

    <context-menu
      :show="showContextMenu"
      :position="contextMenuPosition"
      :is-folder="isFolder"
      @action="handleContextMenuAction"
    />

    <transition name="slide-fade">
      <ul v-if="isOpen && node.children" class="node-children">
        <file-node 
          v-for="child in node.children" 
          :key="child.name" 
          :node="child"
          @select="onChildSelect"
          @add-node="$emit('add-node', $event)"
          @rename-node="$emit('rename-node', $event)"
          @delete-node="$emit('delete-node', $event)"
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
      showContextMenu: false,
      isEditing: false,
      editedName: '',
      contextMenuPosition: { x: 0, y: 0 }
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
    onContextMenu(event) {
      event.preventDefault()
      
      const x = event.clientX
      const y = event.clientY
      
      this.contextMenuPosition = { x, y }
      this.showContextMenu = true
    },
    closeContextMenu() {
      this.showContextMenu = false
    },
    handleContextMenuAction(action) {
      switch (action) {
        case 'newFile':
          this.isOpen = true
          this.$emit('add-node', {
            parent: this.node,
            newNode: { 
              name: 'Nouveau fichier', 
              type: 'file',
              id: Date.now()
            }
          })
          break
        case 'newFolder':
          this.isOpen = true
          this.$emit('add-node', {
            parent: this.node,
            newNode: { 
              name: 'Nouveau dossier', 
              type: 'folder', 
              children: [],
              id: Date.now()
            }
          })
          break
        case 'rename':
          this.startRename()
          break
        case 'delete':
          if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
            this.$emit('delete-node', this.node)
          }
          break
      }
      this.closeContextMenu()
    },
    startRename() {
      this.isEditing = true
      this.editedName = this.node.name
      this.$nextTick(() => {
        const input = this.$refs.nameInput
        input.focus()
        if (!this.isFolder) {
          const lastDotIndex = this.node.name.lastIndexOf('.')
          if (lastDotIndex > 0) {
            input.setSelectionRange(0, lastDotIndex)
          } else {
            input.select()
          }
        } else {
          input.select()
        }
      })
    },
    confirmRename() {
      if (this.editedName.trim() && this.editedName !== this.node.name) {
        this.$emit('rename-node', { node: this.node, newName: this.editedName })
      }
      this.isEditing = false
    },
    cancelRename() {
      this.isEditing = false
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px; /* Ajustez selon vos besoins */
  display: inline-block;
  word-break: keep-all;
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

.name-input {
  background: var(--background-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 2px 4px;
  margin: 0;
  font-size: 0.9em;
  width: auto;
  min-width: 100px;
  outline: none;
  border-radius: 2px;
}

.name-input:focus {
  border-color: var(--focus-color, #0066cc);
  background: var(--input-background, #2d2d2d);
}
</style>