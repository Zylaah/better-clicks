<template>
  <div 
    class="keyboard-key" 
    :class="{ 
      'is-pressed': isPressed || isKeyPressed,
      'is-special': isSpecialKey,
      [`width-${width}`]: true
    }"
    :data-key="label"
    @mousedown="handlePress"
    @mouseup="handleRelease"
    @mouseleave="handleRelease"
    @touchstart.prevent="handlePress"
    @touchend.prevent="handleRelease"
  >
    <div class="key-content">
      <span class="key-label">{{ label }}</span>
      <div class="key-sublabels">
        <span v-if="subLabel" class="key-sublabel">{{ subLabel }}</span>
        <span v-if="thirdLabel" class="key-third-label">{{ thirdLabel }}</span>
      </div>
    </div>
    <div class="key-shadow"></div>
  </div>
</template>

<script>
export default {
  name: 'KeyboardKey',
  
  props: {
    label: {
      type: String,
      required: true
    },
    subLabel: {
      type: String,
      default: ''
    },
    thirdLabel: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 1
    },
    isSpecialKey: {
      type: Boolean,
      default: false
    },
    keyCode: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      isPressed: false,
      isKeyPressed: false
    }
  },

  mounted() {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  },

  unmounted() {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  },

  methods: {
    handlePress() {
      this.isPressed = true
      this.$emit('key-press', {
        key: this.label,
        timestamp: Date.now()
      })
    },

    handleRelease() {
      if (this.isPressed) {
        this.isPressed = false
        this.$emit('key-release', {
          key: this.label,
          timestamp: Date.now()
        })
      }
    },

    handleKeyDown(event) {
      if (this.matchesKey(event)) {
        this.isKeyPressed = true
        this.$emit('key-press', {
          key: this.label,
          timestamp: Date.now()
        })
      }
    },

    handleKeyUp(event) {
      if (this.matchesKey(event)) {
        this.isKeyPressed = false
        this.$emit('key-release', {
          key: this.label,
          timestamp: Date.now()
        })
      }
    },

    matchesKey(event) {
      // Gestion des touches spéciales
      if (this.isSpecialKey) {
        switch (this.label) {
          case 'Shift': return event.code === 'ShiftLeft' || event.code === 'ShiftRight'
          case 'Ctrl': return event.code === 'ControlLeft' || event.code === 'ControlRight'
          case 'Alt': return event.code === 'AltLeft'
          case 'Alt Gr': return event.code === 'AltRight'
          case 'Space': return event.code === 'Space'
          case 'Enter': return event.code === 'Enter'
          case 'Tab': return event.code === 'Tab'
          case '←': return event.code === 'Backspace'
          case 'Caps Lock': return event.code === 'CapsLock'
          case 'Win': return event.code === 'MetaLeft'
          case 'Menu': return event.code === 'ContextMenu'
          default: return false
        }
      }

      // Pour les touches normales, on compare le code de la touche
      if (this.keyCode) {
        return event.code === this.keyCode
      }

      // Si pas de keyCode, on compare la touche elle-même
      return event.key === this.subLabel
    }
  }
}
</script>

<style scoped>
.keyboard-key {
  position: relative;
  min-width: 40px;
  height: 60px;
  margin: 4px;
  background: linear-gradient(145deg, var(--bg-secondary), var(--bg-primary));
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease-in-out;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    -4px -4px 10px -3px rgba(255, 255, 255, 0.05),
    4px 4px 10px -3px rgba(0, 0, 0, 0.2),
    inset -2px -2px 5px -2px rgba(0, 0, 0, 0.1),
    inset 2px 2px 5px -2px rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.keyboard-key:hover {
  transform: translateY(-1px);
  box-shadow: 
    -6px -6px 12px -3px rgba(255, 255, 255, 0.07),
    6px 6px 12px -3px rgba(0, 0, 0, 0.25),
    inset -2px -2px 5px -2px rgba(0, 0, 0, 0.1),
    inset 2px 2px 5px -2px rgba(255, 255, 255, 0.1);
}

.keyboard-key.is-pressed {
  transform: translateY(2px);
  background: linear-gradient(145deg, var(--accent-color), var(--hover-color));
  box-shadow: 
    -2px -2px 5px -3px rgba(255, 255, 255, 0.05),
    2px 2px 5px -3px rgba(0, 0, 0, 0.2),
    inset -4px -4px 8px -3px rgba(0, 0, 0, 0.15),
    inset 4px 4px 8px -3px rgba(255, 255, 255, 0.05);
}

.key-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
  color: var(--text-color);
  padding: 4px 6px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  gap: 2px;
}

.key-shadow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, 
    rgba(var(--accent-color-rgb), 0.7),
    rgba(var(--accent-color-rgb), 0.9)
  );
  border-radius: 0 0 8px 8px;
  transition: all 0.2s ease-in-out;
  opacity: 0.8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.keyboard-key.is-pressed .key-shadow {
  height: 2px;
  opacity: 0.6;
}

.key-label {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  line-height: 1;
  margin: 0;
}

.key-sublabels {
  display: flex;
  justify-content: space-between;
  width: 100%;
  line-height: 1;
  margin: 0;
}

.key-sublabel {
  font-size: 0.75rem;
  opacity: 0.8;
  line-height: 1;
}

.key-third-label {
  font-size: 0.75rem;
  opacity: 0.8;
  color: var(--accent-color);
  line-height: 1;
}

/* Touches spéciales */
.keyboard-key.is-special {
  background: linear-gradient(145deg, 
    var(--bg-tertiary), 
    var(--bg-secondary)
  );
}

/* Largeurs différentes */
.keyboard-key.width-1 { width: 40px; }
.keyboard-key.width-1-5 { width: 60px; }
.keyboard-key.width-1-8 { width: 72px; }
.keyboard-key.width-2 { width: 80px; }
.keyboard-key.width-2-5 { width: 100px; }
.keyboard-key.width-6-25, 
.keyboard-key[data-key="Space"] { 
  width: 300px !important; /* Force la largeur pour la barre d'espace */
}

@media (max-width: 768px) {
  .keyboard-key {
    min-width: 32px;
    height: 45px;
  }
  
  .keyboard-key.width-6-25,
  .keyboard-key[data-key="Space"] {
    width: 400px !important;
  }

  .key-label {
    font-size: 0.9rem;
  }

  .key-sublabel {
    font-size: 0.6rem;
  }
}
</style> 