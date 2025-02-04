<template>
  <div 
    class="keyboard-key" 
    :class="{ 
      'is-pressed': isKeyPressed || (label === 'Caps Lock' && capsLockState),
      'is-special': isSpecialKey,
      'is-active': isActive && !isSpecialKeyCheck,
      'is-highlighted': isHighlighted,
      [`width-${width}`]: true
    }"
    :data-key="label"
  >
    <div class="key-content">
      <span class="key-label" :class="{ 'accent-color': shouldHighlightMain && !isSpecialKeyCheck }">{{ label }}</span>
      <div class="key-sublabels">
        <span v-if="subLabel" class="key-sublabel" :class="{ 'accent-color': shouldHighlightNormal && !isSpecialKeyCheck }">{{ subLabel }}</span>
        <span v-if="thirdLabel" class="key-third-label" :class="{ 'accent-color': shouldHighlightAlt && !isSpecialKeyCheck }">{{ thirdLabel }}</span>
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
    },
    isHighlighted: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isKeyPressed: false,
      isCapsLocked: false,
      isShiftPressed: false,
      isAltPressed: false,
      isCtrlPressed: false,
      pressedKeys: new Set(),
      capsLockState: false,
      spacePressed: false
    }
  },

  computed: {
    isSpecialKeyCheck() {
      const specialKeys = [
        'Shift', 'Ctrl', 'Alt', 'Alt Gr', 'Espace', 'Entrée', 
        'Tab', '←', 'Caps Lock', 'Win', 'Menu'
      ];
      return specialKeys.includes(this.label);
    },

    shouldHighlightMain() {
      if (this.isSpecialKeyCheck) return false;
      return (this.isShiftPressed || this.isCapsLocked) && this.label !== this.subLabel;
    },

    shouldHighlightNormal() {
      if (this.isSpecialKeyCheck) return false;
      return (!this.isShiftPressed && !this.isAltPressed && !this.isCapsLocked) && this.subLabel;
    },

    shouldHighlightAlt() {
      if (this.isSpecialKeyCheck) return false;
      return this.isAltPressed && this.thirdLabel;
    },

    currentCharacter() {
      if (this.isSpecialKeyCheck) return this.label;
      if (this.isAltPressed) return this.thirdLabel || '';
      if (this.isShiftPressed || this.isCapsLocked) return this.label;
      return this.subLabel || '';
    },

    isActive() {
      if (this.label === 'Caps Lock') {
        return this.capsLockState;
      }
      if (this.isSpecialKey) {
        return (this.label === 'Shift' && this.isShiftPressed) ||
               (this.label === 'Alt' && this.isAltPressed) ||
               (this.label === 'Alt Gr' && this.isAltPressed && this.isCtrlPressed) ||
               (this.label === 'Ctrl' && this.isCtrlPressed);
      }
      return this.isKeyPressed;
    }
  },

  mounted() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('keydown', this.handleModifierKeys);
    window.addEventListener('keyup', this.handleModifierKeys);
    window.addEventListener('keypress', this.handleSpaceKey);
    
    this.capsLockState = this.getCapsLockState();
    
    document.addEventListener('keydown', this.checkCapsLock);
  },

  unmounted() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('keydown', this.handleModifierKeys);
    window.removeEventListener('keyup', this.handleModifierKeys);
    window.removeEventListener('keypress', this.handleSpaceKey);
    document.removeEventListener('keydown', this.checkCapsLock);
  },

  methods: {
    handleKeyDown(event) {
      if (this.matchesKey(event)) {
        if (event.code !== 'Space') {
          this.pressedKeys.add(event.code);
          this.isKeyPressed = true;
          
          if (this.label === 'Caps Lock') {
            this.$emit('key-press', {
              key: this.currentCharacter,
              code: this.keyCode,
              timestamp: Date.now(),
              caps: this.capsLockState
            });
          } else {
            this.$emit('key-press', {
              key: this.currentCharacter,
              code: this.keyCode,
              timestamp: Date.now(),
              shift: this.isShiftPressed,
              alt: this.isAltPressed,
              ctrl: this.isCtrlPressed,
              caps: this.capsLockState
            });
          }
        }
      }
    },

    handleKeyUp(event) {
      if (this.pressedKeys.has(event.code) || this.matchesKey(event)) {
        this.pressedKeys.delete(event.code);
        this.isKeyPressed = false;
        
        if (this.label !== 'Caps Lock') {
          this.$emit('key-release', {
            key: this.currentCharacter,
            code: this.keyCode,
            timestamp: Date.now(),
            shift: this.isShiftPressed,
            alt: this.isAltPressed,
            ctrl: this.isCtrlPressed,
            caps: this.capsLockState
          });
        }
      }
    },

    matchesKey(event) {
      if (event.altKey && event.ctrlKey && this.label === 'Ctrl') {
        return false;
      }

      if (this.isSpecialKey) {
        switch (this.label) {
          case 'Shift': return event.code === 'ShiftLeft' || event.code === 'ShiftRight';
          case 'Ctrl': return event.code === 'ControlLeft' || event.code === 'ControlRight';
          case 'Alt': return event.code === 'AltLeft';
          case 'Alt Gr': return event.code === 'AltRight' || (event.altKey && event.ctrlKey);
          case 'Space': return event.code === 'Space';
          case 'Enter': return event.code === 'Enter';
          case 'Tab': return event.code === 'Tab';
          case '←': return event.code === 'Backspace';
          case 'Caps Lock': return event.code === 'CapsLock';
          case 'Win': return event.code === 'MetaLeft';
          case 'Menu': return event.code === 'ContextMenu';
          default: return false;
        }
      }

      if (this.keyCode) {
        return event.code === this.keyCode;
      }

      return event.key === this.subLabel;
    },

    handleModifierKeys(event) {
      if (event.type === 'keydown') {
        if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
          this.isShiftPressed = true;
        }
        if (event.code === 'AltRight' || (event.altKey && event.ctrlKey)) {
          this.isAltPressed = true;
        }
        if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
          this.isCtrlPressed = true;
        }
      } else if (event.type === 'keyup') {
        if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
          this.isShiftPressed = false;
        }
        if (event.code === 'AltRight' || (!event.altKey && !event.ctrlKey)) {
          this.isAltPressed = false;
        }
        if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
          this.isCtrlPressed = false;
        }
      }
    },

    getCapsLockState() {
      try {
        const event = new KeyboardEvent('keydown', {
          key: 'a',
          code: 'KeyA',
          getModifierState: (key) => key === 'CapsLock' && navigator.keyboard?.getModifierState?.('CapsLock')
        });
        return event.getModifierState('CapsLock') || false;
      } catch (e) {
        console.warn('Impossible de détecter l\'état initial du Caps Lock, on assume qu\'il est désactivé');
        return false;
      }
    },

    checkCapsLock(event) {
      if (event.getModifierState) {
        const newCapsLockState = event.getModifierState('CapsLock');
        if (this.capsLockState !== newCapsLockState) {
          this.capsLockState = newCapsLockState;
          this.isCapsLocked = newCapsLockState;
          this.$emit('caps-lock-change', newCapsLockState);
        }
      }
    },

    handleSpaceKey(event) {
      if (event.code === 'Space' || event.key === ' ') {
        if (this.label !== 'Espace' && this.isKeyPressed) {
          this.isKeyPressed = false;
          this.pressedKeys.clear();
          
          this.$emit('key-release', {
            key: this.currentCharacter,
            code: this.keyCode,
            timestamp: Date.now(),
            shift: this.isShiftPressed,
            alt: this.isAltPressed,
            ctrl: this.isCtrlPressed,
            caps: this.capsLockState
          });
        }
      }
    }
  }
}
</script>

<style scoped>
.keyboard-key {
  position: relative;
  width: clamp(3rem, 5vw, 3.75rem);
  height: clamp(3rem, 5vw, 3.75rem);
  margin: clamp(0.125rem, 0.25vw, 0.25rem);
  background: linear-gradient(145deg, var(--bg-secondary), var(--bg-primary));
  border-radius: clamp(0.25rem, 0.5vw, 0.5rem);
  cursor: pointer;
  user-select: none;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--hover-color);
  box-shadow: 
    -4px -4px 10px -3px rgba(255, 255, 255, 0.05),
    4px 4px 10px -3px rgba(0, 0, 0, 0.2),
    inset -2px -2px 5px -2px rgba(0, 0, 0, 0.1),
    inset 2px 2px 5px -2px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transform: translateY(0);
  will-change: transform;
}

.keyboard-key:hover {
  box-shadow: 
    -6px -6px 12px -3px rgba(255, 255, 255, 0.07),
    6px 6px 12px -3px rgba(0, 0, 0, 0.25),
    inset -2px -2px 5px -2px rgba(0, 0, 0, 0.1),
    inset 2px 2px 5px -2px rgba(255, 255, 255, 0.1);
  background: linear-gradient(145deg, 
    var(--bg-secondary), 
    var(--hover-color)
  );
}

.keyboard-key.is-pressed,
.keyboard-key.is-active {
  transform: translateY(2px);
  background: linear-gradient(145deg, var(--accent-color), var(--hover-color));
  box-shadow: 
    -2px -2px 5px -3px rgba(255, 255, 255, 0.05),
    2px 2px 5px -3px rgba(0, 0, 0, 0.2),
    inset -4px -4px 8px -3px rgba(0, 0, 0, 0.15),
    inset 4px 4px 8px -3px rgba(255, 255, 255, 0.05);
  transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}

.keyboard-key.is-pressed .key-content,
.keyboard-key.is-active .key-content {
  transform: scale(0.95);
}

.keyboard-key.is-pressed .key-shadow,
.keyboard-key.is-active .key-shadow {
  height: 2px;
  opacity: 0.6;
}

.keyboard-key.is-long-pressed {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: translateY(2px);
    box-shadow: 0 0 0 0 rgba(var(--accent-color-rgb), 0.7);
  }
  70% {
    transform: translateY(2px);
    box-shadow: 0 0 0 10px rgba(var(--accent-color-rgb), 0);
  }
  100% {
    transform: translateY(2px);
    box-shadow: 0 0 0 0 rgba(var(--accent-color-rgb), 0);
  }
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
  padding: clamp(0.25rem, 0.5vw, 0.375rem) clamp(0.375rem, 0.75vw, 0.5rem);
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  gap: clamp(0.125rem, 0.25vw, 0.25rem);
  transition: transform 0.15s ease;
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
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.key-label {
  font-size: clamp(0.75rem, 1.5vw, 1.1rem);
  font-weight: 600;
  letter-spacing: 0.5px;
  line-height: 1;
  margin: 0;
  transition: color 0.2s ease;
}

.key-sublabels {
  display: flex;
  justify-content: space-between;
  width: 100%;
  line-height: 1;
  margin: 0;
}

.key-sublabel,
.key-third-label {
  font-size: clamp(0.5rem, 1vw, 0.75rem);
  opacity: 0.8;
  line-height: 1;
  transition: color 0.2s ease;
}

/* Touches spéciales */
.keyboard-key.is-special {
  background: linear-gradient(145deg, 
    var(--bg-tertiary), 
    var(--bg-secondary)
  );
  border-color: var(--accent-color);
}

.keyboard-key.is-special:hover {
  background: linear-gradient(145deg, 
    var(--bg-secondary), 
    var(--accent-color)
  );
}

.keyboard-key.is-special.is-pressed {
  background: linear-gradient(145deg, 
    var(--accent-color), 
    var(--bg-tertiary)
  );
}

/* État actif des modificateurs */
.keyboard-key[data-key="ShiftLeft"].is-active,
.keyboard-key[data-key="ShiftRight"].is-active,
.keyboard-key[data-key="AltLeft"].is-active,
.keyboard-key[data-key="AltRight"].is-active,
.keyboard-key[data-key="ControlLeft"].is-active,
.keyboard-key[data-key="ControlRight"].is-active {
  background: linear-gradient(145deg, var(--accent-color), var(--hover-color));
  border-color: var(--accent-color);
}

.accent-color {
  color: var(--accent-color) !important;
  text-shadow: 0 0 8px rgba(var(--accent-color-rgb), 0.3);
}

/* Responsive design */
@media (max-width: 768px) {
  .keyboard-key {
    width: clamp(2.5rem, 4vw, 3rem);
    height: clamp(2.5rem, 4vw, 3rem);
  }
  
  .keyboard-key.width-6-25,
  .keyboard-key[data-key="Space"] {
    width: clamp(15rem, 25vw, 18.75rem) !important;
    height: clamp(2.5rem, 4vw, 3rem);
  }

  .key-label {
    font-size: 0.9rem;
  }

  .key-sublabel,
  .key-third-label {
    font-size: 0.6rem;
  }
}

/* Support des préférences de mouvement réduit */
@media (prefers-reduced-motion: reduce) {
  .keyboard-key {
    transition: none;
  }
  
  .keyboard-key:hover {
    transform: none;
  }
  
  .keyboard-key.is-pressed {
    transform: none;
  }
  
  .keyboard-key.is-long-pressed {
    animation: none;
  }
}

/* Largeurs différentes */
.keyboard-key.width-1 { 
  width: clamp(3rem, 5vw, 3.75rem);
  height: clamp(3rem, 5vw, 3.75rem);
}
.keyboard-key.width-1-5 { 
  width: clamp(4.5rem, 7.5vw, 5.625rem);
  height: clamp(3rem, 5vw, 3.75rem);
}
.keyboard-key.width-1-8 { 
  width: clamp(5.4rem, 9vw, 6.75rem);
  height: clamp(3rem, 5vw, 3.75rem);
}
.keyboard-key.width-2 { 
  width: clamp(6rem, 10vw, 7.5rem);
  height: clamp(3rem, 5vw, 3.75rem);
}
.keyboard-key.width-2-5 { 
  width: clamp(7.5rem, 12.5vw, 9.375rem);
  height: clamp(3rem, 5vw, 3.75rem);
}
.keyboard-key.width-6-25,
.keyboard-key[data-key="Space"] {
  flex-grow: 1;
}
.keyboard-key[data-key="Caps Lock"] {
  flex-grow: 1;
}
.keyboard-key[data-key="Shift"] {
  width: clamp(8rem, 13.5vw, 10rem) !important;
  height: clamp(3rem, 5vw, 3.75rem);
}

.keyboard-key[data-key="ShiftLeft"] {
  flex-grow: 1;
}

.keyboard-key[data-key="ShiftRight"] {
  flex-grow: 1;
}

.keyboard-key[data-key="ShiftLeft"]:hover {
  box-shadow: 
    -6px -6px 12px -3px rgba(255, 255, 255, 0.07),
    6px 6px 12px -3px rgba(0, 0, 0, 0.25),
    inset -2px -2px 5px -2px rgba(0, 0, 0, 0.1),
    inset 2px 2px 5px -2px rgba(255, 255, 255, 0.1);
}

.keyboard-key[data-key="ShiftRight"]:hover {
  box-shadow: 
    -6px -6px 12px -3px rgba(255, 255, 255, 0.07),
    6px 6px 12px -3px rgba(0, 0, 0, 0.25),
    inset -2px -2px 5px -2px rgba(0, 0, 0, 0.1),
    inset 2px 2px 5px -2px rgba(255, 255, 255, 0.1);
}

.keyboard-key:not(.is-highlighted)[data-key="ShiftLeft"].is-pressed {
  transform: translateY(2px);
  background: linear-gradient(145deg, var(--accent-color), var(--hover-color));
  box-shadow: 
    -2px -2px 5px -3px rgba(255, 255, 255, 0.05),
    2px 2px 5px -3px rgba(0, 0, 0, 0.2),
    inset -4px -4px 8px -3px rgba(0, 0, 0, 0.15),
    inset 4px 4px 8px -3px rgba(255, 255, 255, 0.05);
}

.keyboard-key:not(.is-highlighted)[data-key="ShiftRight"].is-pressed {
  transform: translateY(2px);
  background: linear-gradient(145deg, var(--accent-color), var(--hover-color));
  box-shadow: 
    -2px -2px 5px -3px rgba(255, 255, 255, 0.05),
    2px 2px 5px -3px rgba(0, 0, 0, 0.2),
    inset -4px -4px 8px -3px rgba(0, 0, 0, 0.15),
    inset 4px 4px 8px -3px rgba(255, 255, 255, 0.05);
}

.keyboard-key.is-highlighted {
  background: linear-gradient(145deg, rgba(76, 175, 80, 0.3), rgba(76, 175, 80, 0.1));
  border: 2px solid #4CAF50;
  box-shadow: 
    0 0 15px rgba(76, 175, 80, 0.3),
    inset 0 0 5px rgba(76, 175, 80, 0.2);
}

.keyboard-key.is-highlighted .key-label,
.keyboard-key.is-highlighted .key-sublabel,
.keyboard-key.is-highlighted .key-third-label {
  color: #4CAF50;
  text-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
}

.keyboard-key.is-highlighted:hover {
  background: linear-gradient(145deg, rgba(76, 175, 80, 0.4), rgba(76, 175, 80, 0.2));
  box-shadow: 
    0 0 20px rgba(76, 175, 80, 0.4),
    inset 0 0 10px rgba(76, 175, 80, 0.3);
}
</style> 