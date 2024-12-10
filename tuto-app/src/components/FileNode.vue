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
      <span class="node-name">{{ node.name }}</span>
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
      v-click-outside="closeContextMenu"
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
      contextMenuPosition: { x: 0, y: 0 }
    }
  },
  computed: {
    isFolder() {
      return this.node.type === 'folder'
    }
  },
  directives: {
    'click-outside': {
      mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event)
          }
        }
        document.addEventListener('click', el.clickOutsideEvent)
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent)
      }
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
      this.contextMenuPosition = {
        x: event.clientX,
        y: event.clientY
      }
      this.showContextMenu = true
    },
    closeContextMenu() {
      this.showContextMenu = false
    },
    handleContextMenuAction(action) {
      let newName;
      
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
          newName = prompt('Nouveau nom:', this.node.name)
          if (newName) {
            this.$emit('rename-node', { node: this.node, newName })
          }
          break
        case 'delete':
          if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
            this.$emit('delete-node', this.node)
          }
          break
      }
      this.closeContextMenu()
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
</style>