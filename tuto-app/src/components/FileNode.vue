<template>
  <li :class="['file-node', { 'is-folder': isFolder }]">
    <div 
      class="node-content" 
      @click="onNodeClick"
      @contextmenu.prevent="onContextMenu"
      :class="{ 'selected': isNodeSelected }"
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
        @blur="onBlur"
        @keyup.enter="confirmRename"
        @keyup.esc="cancelRename"
        @select.stop="onInputSelect"
      />

      <font-awesome-icon 
        v-if="isFolder" 
        :icon="isOpen ? 'chevron-down' : 'chevron-right'"
        class="chevron-icon" 
      />
    </div>

    <ul v-if="isOpen && node.children" class="node-children">
      <file-node 
        v-for="child in node.children" 
        :key="child.name" 
        :node="child"
        :parent-path="parentPath ? `${parentPath}/${node.name}` : node.name"
        :selected-node="selectedNode"
        @select="onChildSelect"
        @add-node="$emit('add-node', $event)"
        @rename-node="$emit('rename-node', $event)"
        @delete-node="$emit('delete-node', $event)"
      />
    </ul>

    <context-menu
      :show="showContextMenu"
      :position="contextMenuPosition"
      :is-folder="isFolder"
      @action="handleContextMenuAction"
    />

    <delete-confirmation-modal
      :show="showDeleteModal"
      :item-name="node.name"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </li>
</template>

<script>
import ContextMenu from './ContextMenu.vue'
import DeleteConfirmationModal from './DeleteConfirmationModal.vue'
import { onBeforeMount, getCurrentInstance } from 'vue'

export default {
  name: 'FileNode',
  components: {
    ContextMenu,
    DeleteConfirmationModal
  },
  props: {
    node: Object,
    parentPath: {
      type: String,
      default: ''
    },
    selectedNode: {
      type: Object,
      default: null
    }
  },
  computed: {
    isFolder() {
      return this.node.type === 'folder'
    },
    isNodeSelected() {
      return this.selectedNode === this.node
    }
  },
  data() {
    return {
      isOpen: false,
      showContextMenu: false,
      isEditing: false,
      editedName: this.node.name,
      contextMenuPosition: { x: 0, y: 0 },
      showDeleteModal: false
    }
  },
  methods: {
    onNodeClick() {
      console.log('Click sur le nœud:', this.node.name)
      this.toggle()
    },
    toggle() {
      console.log('Toggle appelé pour:', this.node.name)
      if (this.isFolder) {
        this.isOpen = !this.isOpen
        this.select()
      } else {
        this.select()
      }
    },
    select() {
      console.log('Select appelé pour:', this.node.name)
      const currentPath = this.parentPath 
        ? `${this.parentPath}/${this.node.name}`
        : this.node.name
      console.log('Chemin construit:', currentPath)
      this.$emit('select', { node: this.node, path: currentPath })
    },
    onChildSelect(payload) {
      console.log('FileNode - onChildSelect:', payload)
      this.$emit('select', payload)
    },
    onContextMenu(event) {
      event.preventDefault()
      this.contextMenuPosition = {
        x: event.clientX,
        y: event.clientY
      }
      this.showContextMenu = true
      console.log('Context menu ouvert')
      this.select()
    },
    closeContextMenu() {
      this.showContextMenu = false
    },
    handleContextMenuAction(action) {
      if (action === 'close') {
        this.closeContextMenu()
        return
      }
      
      let newNode = null;
      
      switch(action) {
        case 'newFile':
          this.isOpen = true
          newNode = { 
            name: 'Nouveau fichier', 
            type: 'file',
            id: Date.now()
          };
          this.$emit('add-node', {
            parent: this.node,
            newNode
          });
          break
        case 'newFolder':
          this.isOpen = true
          newNode = { 
            name: 'Nouveau dossier', 
            type: 'folder', 
            children: [],
            id: Date.now()
          };
          this.$emit('add-node', {
            parent: this.node,
            newNode
          });
          break
        case 'rename':
          this.startRename(this.node)
          break
        case 'delete':
          this.showDeleteModal = true
          console.log('Delete modal ouvert')
          break
      }
      this.closeContextMenu()
    },
    onInputSelect(event) {
      event.stopPropagation()
    },
    startRename() {
      if (!this.node) return
      
      this.isEditing = false
      this.editedName = ''
      
      this.$nextTick(() => {
        this.isEditing = true
        this.editedName = this.node.name
        
        this.$nextTick(() => {
          const input = this.$refs.nameInput
          if (input) {
            input.focus()
            const selectText = () => {
              if(!this.isFolder) {
                const lastDotIndex = this.node.name.lastIndexOf('.');
                if (lastDotIndex > 0) {
                  input.setSelectionRange(0, lastDotIndex);
                } else {
                  input.select()
                }
              } else {
                input.select()
              }
            }
            selectText()
          }
        })
      })
    },
    onBlur(event) {
      event.stopPropagation()
      this.confirmRename()
    },
    confirmRename() {
      console.log('Confirmation du renommage...')
      console.log('Nom édité:', this.editedName)
      console.log('Nom actuel:', this.node.name)
      
      if (this.editedName && this.editedName !== this.node.name) {
        console.log('Le nom a été modifié, émission de l\'événement rename-node')
        this.$emit('rename-node', {
          node: this.node,
          newName: this.editedName
        })
        
        const currentPath = this.parentPath 
          ? `${this.parentPath}/${this.editedName}`
          : this.editedName
        console.log('Nouveau chemin calculé:', currentPath)
        
        console.log('Émission de l\'événement select avec le nouveau chemin')
        this.$emit('select', { 
          node: this.node, 
          path: currentPath 
        })
      } else {
        console.log('Pas de modification du nom ou nom invalide')
      }
      this.cancelRename()
    },
    confirmDelete() {
      this.$emit('delete-node', this.node)
      this.showDeleteModal = false
    },
    cancelDelete() {
      this.showDeleteModal = false
    },
    cancelRename() {
      console.log('Annulation du mode édition')
      this.isEditing = false
      this.editedName = ''
    }
  },
  setup() {
    const { proxy: app } = getCurrentInstance()
    
    onBeforeMount(async () => {
      await Promise.all([
        app.$loadIcon('folder'),
        app.$loadIcon('folderOpen'),
        app.$loadIcon('file'),
        app.$loadIcon('chevronRight'),
        app.$loadIcon('chevronDown')
      ])
    })
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

.node-label {
  user-select: none;
  -webkit-user-select: none; /* Pour Safari */
  -moz-user-select: none; /* Pour Firefox */
  -ms-user-select: none; /* Pour IE/Edge */
}

.node-content:hover {
  background-color: #2a2d2e;
}

.node-content.selected {
  background-color: var(--selected-node-bg);
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
  z-index: 1000;
}

.name-input:focus {
  border-color: var(--focus-color, #0066cc);
  background: var(--input-background, #2d2d2d);
}
</style>