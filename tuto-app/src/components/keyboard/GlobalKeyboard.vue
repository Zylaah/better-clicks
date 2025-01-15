<template>
  <Suspense>
    <template #default>
      <AzuretyKeyboard
        v-bind="$attrs"
        @key-press="handleKeyPress"
        @key-release="handleKeyRelease"
      />
    </template>
    <template #fallback>
      <div class="keyboard-loading">
        <p>Chargement du clavier...</p>
      </div>
    </template>
  </Suspense>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { useKeyboardStore } from '@/stores/keyboard'

const AzuretyKeyboard = defineAsyncComponent({
  loader: () => import('./AzuretyKeyboard.vue'),
  timeout: 5000,
  suspensible: true
})

export default {
  name: 'GlobalKeyboard',
  
  components: {
    AzuretyKeyboard
  },
  
  inheritAttrs: false,

  setup() {
    const store = useKeyboardStore()

    const handleKeyPress = (event) => {
      store.handleKeyPress(event)
    }

    const handleKeyRelease = (event) => {
      store.handleKeyRelease(event)
    }

    return {
      handleKeyPress,
      handleKeyRelease
    }
  }
}
</script>

<style scoped>
.keyboard-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background: var(--bg-secondary);
  border-radius: 12px;
  font-size: 1.2rem;
  color: var(--text-color);
  opacity: 0.8;
}
</style> 