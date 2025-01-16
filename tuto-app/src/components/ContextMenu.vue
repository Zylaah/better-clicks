<template>
  <Teleport to="body">
    <div v-if="show">
      <div 
        ref="menu"
        class="context-menu" 
        :style="menuStyle"
        @click.stop
      >
        <div class="menu-items">
          <template v-if="isFolder">
            <div class="menu-item" @click="$emit('action', 'newFile')">
              <font-awesome-icon icon="file" />
              <span>Nouveau fichier</span>
            </div>
            <div class="menu-item" @click="$emit('action', 'newFolder')">
              <font-awesome-icon icon="folder" />
              <span>Nouveau dossier</span>
            </div>
            <div class="menu-divider"></div>
          </template>
          
          <div class="menu-item" @click="$emit('action', 'rename')">
            <font-awesome-icon icon="edit" />
            <span>Renommer</span>
          </div>
          <div class="menu-item delete" @click="$emit('action', 'delete')">
            <font-awesome-icon icon="trash" />
            <span>Supprimer</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick, onBeforeMount, getCurrentInstance } from 'vue'

// eslint-disable-next-line no-undef
const props = defineProps({
  show: Boolean,
  position: Object,
  isFolder: Boolean
})

// eslint-disable-next-line no-undef
const emit = defineEmits(['action'])
const menu = ref(null)

const menuStyle = computed(() => {
  if (!props.position) return {}
  
  return {
    left: `${props.position.x}px`,
    top: `${props.position.y}px`
  }
})

// Gestion du clic en dehors du menu
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', adjustMenuPosition)
  window.addEventListener('scroll', adjustMenuPosition)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', adjustMenuPosition)
  window.removeEventListener('scroll', adjustMenuPosition)
})

const handleClickOutside = (event) => {
  if (menu.value && !menu.value.contains(event.target)) {
    emit('action', 'close')
  }
}

// Gestion de la position du menu
const adjustMenuPosition = () => {
  if (!menu.value || !props.show) return

  const menuRect = menu.value.getBoundingClientRect()
  const { innerWidth, innerHeight } = window
  
  let { x, y } = props.position
  
  // Ajuster horizontalement si nécessaire
  if (x + menuRect.width > innerWidth) {
    x = innerWidth - menuRect.width - 5
  }
  
  // Ajuster verticalement si nécessaire
  if (y + menuRect.height > innerHeight) {
    y = innerHeight - menuRect.height - 5
  }
  
  menu.value.style.left = `${x}px`
  menu.value.style.top = `${y}px`
}

watch(() => props.show, (newValue) => {
  if (newValue) {
    nextTick(adjustMenuPosition)
  }
})

const { proxy: app } = getCurrentInstance()

onBeforeMount(async () => {
  await Promise.all([
    app.$loadIcon('file'),
    app.$loadIcon('folder'),
    app.$loadIcon('edit'),
    app.$loadIcon('trash')
  ])
})
</script>

<style scoped>
.context-menu {
  position: fixed;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  opacity: 0;
  transform: scale(0.95);
  animation: menuAppear 0.1s ease forwards;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.menu-items {
  padding: 6px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-color);
  font-size: 0.9rem;
}

.menu-item:hover {
  background-color: var(--hover-color);
}

.menu-item.delete {
  color: var(--error-color);
}

.menu-item.delete:hover {
  background-color: var(--error-color);
  color: white;
}

.menu-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 6px 0;
}

@keyframes menuAppear {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>