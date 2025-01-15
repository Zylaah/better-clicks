import { ref, onBeforeUnmount } from 'vue'

export function useKeyboardEvents(options = {}) {
  const {
    onKeyPress = null,
    onKeyRelease = null,
    isEnabled = true
  } = options

  const enterKeyListener = ref(null)
  const keyPressListener = ref(null)
  const keyReleaseListener = ref(null)

  const addEnterKeyListener = (callback) => {
    removeEnterKeyListener()
    
    enterKeyListener.value = (event) => {
      if (event.key === 'Enter' && isEnabled) {
        callback(event)
        removeEnterKeyListener()
      }
    }
    
    document.addEventListener('keydown', enterKeyListener.value, { passive: true })
  }

  const addKeyListeners = () => {
    if (onKeyPress) {
      keyPressListener.value = (event) => {
        if (isEnabled) {
          onKeyPress(event)
        }
      }
      document.addEventListener('keydown', keyPressListener.value, { passive: true })
    }

    if (onKeyRelease) {
      keyReleaseListener.value = (event) => {
        if (isEnabled) {
          onKeyRelease(event)
        }
      }
      document.addEventListener('keyup', keyReleaseListener.value, { passive: true })
    }
  }

  const removeEnterKeyListener = () => {
    if (enterKeyListener.value) {
      document.removeEventListener('keydown', enterKeyListener.value)
      enterKeyListener.value = null
    }
  }

  const removeKeyListeners = () => {
    if (keyPressListener.value) {
      document.removeEventListener('keydown', keyPressListener.value)
      keyPressListener.value = null
    }
    if (keyReleaseListener.value) {
      document.removeEventListener('keyup', keyReleaseListener.value)
      keyReleaseListener.value = null
    }
  }

  const cleanupListeners = () => {
    removeEnterKeyListener()
    removeKeyListeners()
  }

  // Nettoyage automatique des écouteurs lors du démontage
  onBeforeUnmount(cleanupListeners)

  return {
    addEnterKeyListener,
    addKeyListeners,
    removeEnterKeyListener,
    removeKeyListeners,
    cleanupListeners
  }
} 