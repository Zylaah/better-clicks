import { defineStore } from 'pinia'

export const useKeyboardStore = defineStore('keyboard', {
  state: () => ({
    pressedKeys: new Set(),
    activeModifiers: new Set(),
    lockedModifiers: new Set(),
    isCapsLocked: false,
    isNumLocked: false,
    lastKeyPressTime: 0,
    keyPressCount: 0,
    typingSpeed: 0,
    highlightedKeys: [],
    cachedHighlightedKeys: {
      char: null,
      modifiers: null,
      keys: []
    }
  }),

  getters: {
    isShiftActive: (state) => 
      state.activeModifiers.has('ShiftLeft') || state.activeModifiers.has('ShiftRight'),
    
    isAltActive: (state) =>
      state.activeModifiers.has('AltLeft') || state.activeModifiers.has('AltRight'),
    
    isCtrlActive: (state) =>
      state.activeModifiers.has('ControlLeft') || state.activeModifiers.has('ControlRight'),
    
    hasLockedModifiers: (state) => state.lockedModifiers.size > 0
  },

  actions: {
    handleKeyPress(event) {
      // Si c'est la touche espace, relâcher toutes les autres touches
      if (event.code === 'Space') {
        this.pressedKeys.forEach(key => {
          if (key !== 'Space') {
            this.handleKeyRelease({
              key: key,
              code: event.code,
              timestamp: Date.now()
            })
          }
        })
        this.pressedKeys.clear()
      }

      // Ajouter la touche à la liste des touches pressées
      this.pressedKeys.add(event.key)

      // Calcul de la vitesse de frappe (seulement pour les frappes non répétées)
      if (!event.repeat) {
        const now = Date.now()
        if (now - this.lastKeyPressTime < 5000) {
          this.keyPressCount++
          this.typingSpeed = Math.round((this.keyPressCount / 5) * 60)
        } else {
          this.keyPressCount = 1
        }
        this.lastKeyPressTime = now
      }
    },

    handleKeyRelease(event) {
      this.pressedKeys.delete(event.key)
    },

    handleModifierChange(key, isActive) {
      if (isActive) {
        this.activeModifiers.add(key)
      } else {
        this.activeModifiers.delete(key)
      }
    },

    handleModifierLock(event) {
      const { key, locked } = event
      if (locked) {
        this.lockedModifiers.add(key)
      } else {
        this.lockedModifiers.delete(key)
      }
    },

    updateHighlightedKeys(keys) {
      this.highlightedKeys = keys
    },

    updateHighlightedKeysCache(char, modifiers) {
      this.cachedHighlightedKeys = {
        char,
        modifiers,
        keys: [char, ...(modifiers || [])]
      }
      return this.cachedHighlightedKeys.keys
    },

    reset() {
      this.pressedKeys.clear()
      this.activeModifiers.clear()
      this.lockedModifiers.clear()
      this.isCapsLocked = false
      this.isNumLocked = false
      this.keyPressCount = 0
      this.typingSpeed = 0
      this.highlightedKeys = []
      this.cachedHighlightedKeys = {
        char: null,
        modifiers: null,
        keys: []
      }
    }
  }
}) 