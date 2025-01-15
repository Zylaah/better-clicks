<template>
  <div class="keyboard">
    <!-- <div v-if="showDebugControls" class="debug-controls">
      <button @click="toggleDebug" class="debug-button">
        {{ debugMode ? 'Désactiver' : 'Activer' }} le mode débogage
      </button>
    </div> -->

    <div class="keyboard-container">
      <!-- Première rangée - Chiffres -->
      <div class="key-row">
        <KeyboardKey 
          v-for="(key, index) in keyboardLayout[0]"
          :key="index"
          :label="key.main"
          :sub-label="key.normal"
          :third-label="key.alt"
          :key-code="keyCodes[key.normal]"
          :is-highlighted="highlightedKeys.includes(key.normal) || highlightedKeys.includes(key.main) || highlightedKeys.includes(key.alt)"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
        <KeyboardKey 
          label="←"
          :width="2"
          :is-special="true"
          key-code="Backspace"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
      </div>

      <!-- Deuxième rangée -->
      <div class="key-row">
        <KeyboardKey 
          label="Tab"
          :width="2"
          :is-special="true"
          key-code="Tab"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
        <KeyboardKey 
          v-for="(key, index) in keyboardLayout[1]"
          :key="index"
          :label="key.main"
          :sub-label="key.normal"
          :third-label="key.alt"
          :key-code="keyCodes[key.normal]"
          :is-highlighted="highlightedKeys.includes(key.normal) || highlightedKeys.includes(key.main) || highlightedKeys.includes(key.alt)"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
        <KeyboardKey 
          label="µ"
          :sub-label="'*'"
          :key-code="keyCodes['*']"
          :is-highlighted="highlightedKeys.includes('*')"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
      </div>

      <!-- Troisième rangée -->
      <div class="key-row">
        <KeyboardKey 
          label="Caps Lock"
          :width="2-5"
          :is-special="true"
          key-code="CapsLock"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
        <KeyboardKey 
          v-for="(key, index) in keyboardLayout[2]"
          :key="index"
          :label="key.main"
          :sub-label="key.normal"
          :third-label="key.alt"
          :key-code="keyCodes[key.normal]"
          :is-highlighted="highlightedKeys.includes(key.normal) || highlightedKeys.includes(key.main) || highlightedKeys.includes(key.alt)"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
        <KeyboardKey 
          label="Entrée"
          :width="2"
          :is-special="true"
          key-code="Enter"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
      </div>

      <!-- Quatrième rangée -->
      <div class="key-row">
        <KeyboardKey 
          label="Shift"
          :width="2"
          :is-special="true"
          key-code="ShiftLeft"
          data-key="ShiftLeft"
          :is-highlighted="highlightedKeys.includes('ShiftLeft')"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
        <KeyboardKey 
          v-for="(key, index) in keyboardLayout[3]"
          :key="index"
          :label="key.main"
          :sub-label="key.normal"
          :third-label="key.alt"
          :key-code="keyCodes[key.normal]"
          :is-highlighted="highlightedKeys.includes(key.normal) || highlightedKeys.includes(key.main) || highlightedKeys.includes(key.alt)"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
        <KeyboardKey 
          label="Shift"
          :width="2"
          :is-special="true"
          key-code="ShiftRight"
          data-key="ShiftRight"
          :is-highlighted="highlightedKeys.includes('ShiftRight')"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
      </div>

      <!-- Cinquième rangée -->
      <div class="key-row">
        <KeyboardKey 
          label="Ctrl"
          :width="1.5"
          :is-special="true"
          key-code="ControlLeft"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
        <KeyboardKey 
          label="Win"
          :width="1.5"
          :is-special="true"
          key-code="MetaLeft"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
        <KeyboardKey 
          label="Alt"
          :width="1.5"
          :is-special="true"
          key-code="AltLeft"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
        <KeyboardKey 
          label="Espace"
          :width="6.25"
          :is-special="true"
          key-code="Space"
          data-key="Space"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
        <KeyboardKey 
          label="Alt Gr"
          :width="1.5"
          :is-special="true"
          key-code="AltRight"
          :is-highlighted="highlightedKeys.includes('AltRight')"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
        <KeyboardKey 
          label="Menu"
          :width="1.5"
          :is-special="true"
          key-code="ContextMenu"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
        <KeyboardKey 
          label="Ctrl"
          :width="1.5"
          :is-special="true"
          key-code="ControlRight"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
      </div>
    </div>

    <!-- Journal des événements -->
    <!-- <div v-if="showEventLog" class="event-log">
      <h3>Journal des Événements</h3>
      <div class="log-container">
        <div v-for="(log, index) in eventLogs" :key="index" class="log-entry">
          {{ log }}
        </div>
      </div>
    </div> -->

    <!-- Mode débogage -->
    <!-- <div v-if="debugMode" class="debug-log">
      <h3>Mode Débogage</h3>
      <div class="debug-info">
        <p>Appuyez sur une touche pour voir son code</p>
        <div v-if="lastKeyInfo" class="debug-key-info">
          <p>Dernière touche pressée :</p>
          <ul>
            <li>Key: {{ lastKeyInfo.key }}</li>
            <li>Code: {{ lastKeyInfo.code }}</li>
            <li>KeyCode: {{ lastKeyInfo.keyCode }}</li>
            <li>Shift: {{ lastKeyInfo.shift }}</li>
            <li>Alt: {{ lastKeyInfo.alt }}</li>
            <li>AltGr: {{ lastKeyInfo.altGr }}</li>
            <li>Ctrl: {{ lastKeyInfo.ctrl }}</li>
          </ul>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import KeyboardKey from './KeyboardKey.vue'
import { useKeyboardStore } from '@/stores/keyboard'
import { storeToRefs } from 'pinia'

export default {
  name: 'AzuretyKeyboard',
  
  components: {
    KeyboardKey
  },

  props: {
    showDebugControls: {
      type: Boolean,
      default: false
    },
    showEventLog: {
      type: Boolean,
      default: false
    },
    maxLogEntries: {
      type: Number,
      default: 10
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    highlightedKeys: {
      type: Array,
      default: () => []
    }
  },

  emits: [
    'key-press',
    'key-release',
    'key-repeat',
    'long-press',
    'debug-toggle',
    'debug-key-info',
    'modifier-change',
    'modifier-lock'
  ],

  setup() {
    const store = useKeyboardStore()
    const { 
      pressedKeys,
      activeModifiers,
      lockedModifiers,
      isCapsLocked,
      isNumLocked,
      typingSpeed,
      isShiftActive,
      isAltActive,
      isCtrlActive,
      hasLockedModifiers
    } = storeToRefs(store)

    return {
      store,
      pressedKeys,
      activeModifiers,
      lockedModifiers,
      isCapsLocked,
      isNumLocked,
      typingSpeed,
      isShiftActive,
      isAltActive,
      isCtrlActive,
      hasLockedModifiers
    }
  },

  data() {
    return {
      eventLogs: [],
      debugMode: false,
      lastKeyInfo: null,
      lastRepeatTime: 0,
      repeatRateLimit: 32, // Augmenté de 16 à 32ms pour optimisation
      keyboardLayout: [
        // Première rangée
        [
          { main: '²', normal: '²', alt: '' },
          { main: '1', normal: '&', alt: '' },
          { main: '2', normal: 'é', alt: '~' },
          { main: '3', normal: '"', alt: '#' },
          { main: '4', normal: "'", alt: '{' },
          { main: '5', normal: '(', alt: '[' },
          { main: '6', normal: '-', alt: '|' },
          { main: '7', normal: 'è', alt: '`' },
          { main: '8', normal: '_', alt: '\\' },
          { main: '9', normal: 'ç', alt: '^' },
          { main: '0', normal: 'à', alt: '@' },
          { main: '°', normal: ')', alt: ']' },
          { main: '+', normal: '=', alt: '}' }
        ],
        // Deuxième rangée
        [
          { main: 'A', normal: 'a', alt: '' },
          { main: 'Z', normal: 'z', alt: '' },
          { main: 'E', normal: 'e', alt: '€' },
          { main: 'R', normal: 'r', alt: '' },
          { main: 'T', normal: 't', alt: '' },
          { main: 'Y', normal: 'y', alt: '' },
          { main: 'U', normal: 'u', alt: '' },
          { main: 'I', normal: 'i', alt: '' },
          { main: 'O', normal: 'o', alt: '' },
          { main: 'P', normal: 'p', alt: '' },
          { main: '¨', normal: '^', alt: '' },
          { main: '£', normal: '$', alt: '¤' }
        ],
        // Troisième rangée
        [
          { main: 'Q', normal: 'q', alt: '' },
          { main: 'S', normal: 's', alt: '' },
          { main: 'D', normal: 'd', alt: '' },
          { main: 'F', normal: 'f', alt: '' },
          { main: 'G', normal: 'g', alt: '' },
          { main: 'H', normal: 'h', alt: '' },
          { main: 'J', normal: 'j', alt: '' },
          { main: 'K', normal: 'k', alt: '' },
          { main: 'L', normal: 'l', alt: '' },
          { main: 'M', normal: 'm', alt: '' },
          { main: '%', normal: 'ù', alt: '' }
        ],
        // Quatrième rangée
        [
          { main: '>', normal: '<', alt: '' },
          { main: 'W', normal: 'w', alt: '' },
          { main: 'X', normal: 'x', alt: '' },
          { main: 'C', normal: 'c', alt: '' },
          { main: 'V', normal: 'v', alt: '' },
          { main: 'B', normal: 'b', alt: '' },
          { main: 'N', normal: 'n', alt: '' },
          { main: '?', normal: ',', alt: '' },
          { main: '.', normal: ';', alt: '' },
          { main: '/', normal: ':', alt: '' },
          { main: '§', normal: '!', alt: '' }
        ]
      ],
      keyCodes: {
        // Lettres
        'a': 'KeyQ',
        'z': 'KeyW',
        'e': 'KeyE',
        'r': 'KeyR',
        't': 'KeyT',
        'y': 'KeyY',
        'u': 'KeyU',
        'i': 'KeyI',
        'o': 'KeyO',
        'p': 'KeyP',
        'q': 'KeyA',
        's': 'KeyS',
        'd': 'KeyD',
        'f': 'KeyF',
        'g': 'KeyG',
        'h': 'KeyH',
        'j': 'KeyJ',
        'k': 'KeyK',
        'l': 'KeyL',
        'm': 'Semicolon',
        'w': 'KeyZ',
        'x': 'KeyX',
        'c': 'KeyC',
        'v': 'KeyV',
        'b': 'KeyB',
        'n': 'KeyN',
        // Ponctuation
        '?': 'KeyM',       // Virgule avec Shift
        ',': 'KeyM',       // Virgule sans Shift
        '.': 'Comma',      // Point avec Shift
        ';': 'Comma',      // Point-virgule sans Shift
        '/': 'Period',     // Slash avec Shift
        ':': 'Period',     // Deux-points sans Shift
        '§': 'Slash',      // Section avec Shift
        '!': 'Slash',      // Point d'exclamation sans Shift
        // Chiffres et symboles
        '²': 'Backquote',
        '&': 'Digit1',
        'é': 'Digit2',
        '"': 'Digit3',
        "'": 'Digit4',
        '(': 'Digit5',
        '-': 'Digit6',
        'è': 'Digit7',
        '_': 'Digit8',
        'ç': 'Digit9',
        'à': 'Digit0',
        ')': 'Minus',
        '=': 'Equal',
        '^': 'BracketLeft',
        '$': 'BracketRight',
        'ù': 'Quote',
        '*': 'Backslash',
        '<': 'IntlBackslash',
        '>': 'IntlBackslash'  // Ajout du chevron fermant
      },
    }
  },

  computed: {
    keyboardClasses() {
      return [
        'keyboard',
        `theme-${this.theme}`,
        `size-${this.size}`,
        {
          'is-disabled': this.isDisabled,
          'caps-locked': this.isCapsLocked,
          'num-locked': this.isNumLocked
        }
      ]
    }
  },

  watch: {
    activeModifiers: {
      handler() {
        this.$emit('modifier-change', {
          shift: this.isShiftActive,
          alt: this.isAltActive,
          ctrl: this.isCtrlActive,
          caps: this.isCapsLocked,
          num: this.isNumLocked
        })
      },
      deep: true
    }
  },

  mounted() {
    if (this.debugMode) {
      window.addEventListener('keydown', this.handleDebugKeyDown)
    }
  },

  unmounted() {
    window.removeEventListener('keydown', this.handleDebugKeyDown)
  },

  methods: {
    toggleDebug() {
      this.debugMode = !this.debugMode
      this.$emit('debug-toggle', this.debugMode)
      if (this.debugMode) {
        window.addEventListener('keydown', this.handleDebugKeyDown)
      } else {
        window.removeEventListener('keydown', this.handleDebugKeyDown)
        this.lastKeyInfo = null
      }
    },

    handleDebugKeyDown(event) {
      event.preventDefault()
      this.lastKeyInfo = {
        key: event.key,
        code: event.code,
        keyCode: event.keyCode,
        shift: event.shiftKey,
        alt: event.altKey,
        altGr: event.altKey && event.ctrlKey,
        ctrl: event.ctrlKey
      }
      this.$emit('debug-key-info', this.lastKeyInfo)
      this.addLog(`Debug - Touche: ${event.key}, Code: ${event.code}`)
    },

    logKeyPress(event) {
      // Limiter le taux de répétition
      if (event.repeat) {
        const now = Date.now()
        if (now - this.lastRepeatTime < this.repeatRateLimit) {
          return
        }
        this.lastRepeatTime = now
      }

      this.store.handleKeyPress(event)

      this.$emit('key-press', {
        ...event,
        typingSpeed: this.typingSpeed,
        modifiers: {
          shift: this.isShiftActive,
          alt: this.isAltActive,
          ctrl: this.isCtrlActive,
          caps: this.isCapsLocked
        }
      })

      if (!event.repeat) {
        this.addLog(`Touche pressée: ${event.key} à ${new Date(event.timestamp).toLocaleTimeString()}`)
      }
    },

    logKeyRelease(event) {
      this.store.handleKeyRelease(event)
      this.$emit('key-release', event)
      this.addLog(`Touche relâchée: ${event.key} à ${new Date(event.timestamp).toLocaleTimeString()}`)
    },

    addLog(message) {
      if (this.showEventLog) {
        this.eventLogs.unshift(message)
        if (this.eventLogs.length > this.maxLogEntries) {
          this.eventLogs.pop()
        }
      }
    },

    handleModifierChange(key, isActive) {
      this.store.handleModifierChange(key, isActive)
    },

    handleModifierLock(event) {
      this.store.handleModifierLock(event)
      
      this.$emit('modifier-change', {
        shift: this.isShiftActive,
        alt: this.isAltActive,
        ctrl: this.isCtrlActive,
        caps: this.isCapsLocked,
        locked: Array.from(this.lockedModifiers)
      })
    }
  }
}
</script>

<style scoped>
/* Variables CSS locales */
:root {
  --keyboard-padding: clamp(0.5rem, 1vw, 1rem);
  --keyboard-gap: clamp(0.125rem, 0.25vw, 0.25rem);
  --keyboard-radius: clamp(0.5rem, 1vw, 1rem);
  --keyboard-margin: clamp(1rem, 1vh, 2rem);
}

/* Base */
.keyboard {
  margin: var(--keyboard-margin) auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform-origin: top center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.keyboard-container {
  background: var(--bg-secondary);
  padding: var(--keyboard-padding);
  border-radius: var(--keyboard-radius);
  box-shadow: 
    0 -4px 10px -3px rgba(255, 255, 255, 0.05),
    0 4px 10px -3px var(--accent-color);
  border: 1px solid var(--hover-color);
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--keyboard-gap);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Rangées */
.key-row {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--keyboard-gap);
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  transition: transform 0.3s ease;
}

.key-row:has(.keyboard-key.is-pressed) {
  transform: translateY(1px);
}

/* États */
.keyboard.is-disabled {
  opacity: 0.7;
  pointer-events: none;
  filter: grayscale(0.5);
}

/* Thèmes */
.theme-modern .keyboard-container {
  background: rgba(var(--bg-secondary-rgb), 0.8);
  border: none;
  box-shadow: 
    0 10px 30px -10px rgba(0, 0, 0, 0.3),
    0 -10px 30px -10px rgba(255, 255, 255, 0.1);
}

.theme-minimal .keyboard-container {
  background: transparent;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

/* Tailles */
.size-small { transform: scale(0.8); }
.size-large { transform: scale(1.2); }

/* États des modificateurs */
.caps-locked .keyboard-key[data-key="CapsLock"],
.num-locked .keyboard-key[data-key="NumLock"] {
  background: linear-gradient(145deg, var(--accent-color), var(--hover-color));
  border-color: var(--accent-color);
}

/* Responsive */
@media (max-width: 1180px) {
  .keyboard {
    transform: scale(0.9);
  }
  
  .keyboard-container {
    padding: 0.5rem;
  }
}

@media (max-width: 768px) {
  .keyboard { transform: scale(0.8); }
}

@media (max-width: 480px) {
  .keyboard { transform: scale(0.7); }
}

/* Réduction des animations */
@media (prefers-reduced-motion: reduce) {
  .keyboard,
  .key-row {
    transition: none;
  }
  
  .key-row:has(.keyboard-key.is-pressed) {
    transform: none;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.keyboard-container {
  animation: fadeIn 0.3s ease-out;
}

/* Journal et débogage */
.event-log,
.debug-log {
  --log-padding: 1.5rem;
  margin-top: 2rem;
  padding: var(--log-padding);
  background: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-width: 600px;
  width: 100%;
  animation: fadeIn 0.3s ease-out;
}

.log-container {
  max-height: 200px;
  overflow-y: auto;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
  scrollbar-width: thin;
  scrollbar-color: var(--accent-color) var(--bg-secondary);
}

/* Scrollbar personnalisée */
.log-container::-webkit-scrollbar {
  width: 6px;
}

.log-container::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 3px;
}

.log-container::-webkit-scrollbar-thumb {
  background-color: var(--accent-color);
  border-radius: 3px;
}

.log-entry {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  background: var(--bg-secondary);
  font-family: monospace;
  font-size: 0.9rem;
  line-height: 1.4;
  transition: background-color 0.2s ease;
}

.log-entry:hover {
  background: var(--hover-color);
}
</style> 