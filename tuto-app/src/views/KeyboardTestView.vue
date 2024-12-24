<template>
  <div class="keyboard-test">
    <h1>Simulateur de Clavier</h1>
    
    <AzuretyKeyboard
      :show-debug-controls="true"
      :show-event-log="true"
      :max-log-entries="10"
      @key-press="handleKeyPress"
      @key-release="handleKeyRelease"
      @debug-toggle="handleDebugToggle"
      @debug-key-info="handleDebugKeyInfo"
    />
  </div>
</template>

<script>
import AzuretyKeyboard from '@/components/keyboard/AzuretyKeyboard.vue'

export default {
  name: 'KeyboardTestView',
  
  components: {
    AzuretyKeyboard
  },

  methods: {
    handleKeyPress(event) {
      console.log('Touche pressée:', event)
    },

    handleKeyRelease(event) {
      console.log('Touche relâchée:', event)
    },

    handleDebugToggle(isEnabled) {
      console.log('Mode debug:', isEnabled)
    },

    handleDebugKeyInfo(keyInfo) {
      console.log('Info debug:', keyInfo)
    }
  }
}
</script>

<style scoped>
.keyboard-test {
  margin-top: max(9vh, 5rem);
  padding: 2rem;
}

h1 {
  color: var(--accent-color);
  margin-bottom: 2rem;
  font-size: 2rem;
  text-align: center;
}

@media (max-height: 816px) {
  .keyboard-test {
    scale: 0.9;
    margin-top: max(7vh, 4rem);
  }
}

@media (max-width: 1180px) {
  .keyboard-test {
    display: none;
  }
}
</style>
