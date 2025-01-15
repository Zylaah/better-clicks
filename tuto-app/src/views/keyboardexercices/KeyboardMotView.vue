<template>
  <!-- Add your template code here -->
</template>

<script>
export default {
  data() {
    return {
      textContent: '',
      currentMotIndex: 0,
      isCorrect: false,
      isIncorrect: false,
      validationMessage: '',
      isExerciseComplete: false,
      motsExemple: motCache.getRandomMots(20),
      cachedHighlightedKeys: {
        char: null,
        modifiers: null,
        keys: []
      }
    }
  },

  computed: {
    highlightedKeys() {
      const currentMot = this.motsExemple[this.currentMotIndex]
      if (!currentMot) return []
      
      const currentChar = this.textContent.length < currentMot.length 
        ? currentMot[this.textContent.length] 
        : ''
      
      if (this.cachedHighlightedKeys.char === currentChar) {
        return this.cachedHighlightedKeys.keys
      }
      
      return this.store.updateHighlightedKeysCache(currentChar, [])
    }
  },

  // Add any necessary component options here
}
</script>

<style>
  /* Add your styles here */
</style> 