<template>
  <div class="keyboard-test">
    <h1>Simulateur de Clavier</h1>
    
    <div class="debug-controls">
      <button @click="toggleDebug" class="debug-button">
        {{ debugMode ? 'Désactiver' : 'Activer' }} le mode débogage
      </button>
    </div>

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
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
        <KeyboardKey 
          label="µ"
          :sub-label="'*'"
          :key-code="keyCodes['*']"
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
      </div>

      <!-- Troisième rangée -->
      <div class="key-row">
        <KeyboardKey 
          label="Caps Lock"
          :width="1.8"
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
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
        <KeyboardKey 
          label="Enter"
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
          @key-press="logKeyPress"
          @key-release="logKeyRelease"
        />
        <KeyboardKey 
          label="Shift"
          :width="2"
          :is-special="true"
          key-code="ShiftRight"
          data-key="ShiftRight"
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
          label="Space"
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

    <div class="event-log">
      <h3>Journal des Événements</h3>
      <div class="log-container">
        <div v-for="(log, index) in eventLogs" :key="index" class="log-entry">
          {{ log }}
        </div>
      </div>
    </div>

    <div v-if="debugMode" class="debug-log">
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
    </div>
  </div>
</template>

<script>
import KeyboardKey from '@/components/keyboard/KeyboardKey.vue'

export default {
  name: 'KeyboardTestView',
  
  components: {
    KeyboardKey
  },

  data() {
    return {
      eventLogs: [],
      debugMode: false,
      lastKeyInfo: null,
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
      }
    }
  },

  mounted() {
    if (this.debugMode) {
      window.addEventListener('keydown', this.handleDebugKeyDown)
    }
    const mobileMessage = document.querySelector('.mobile-message');
    if (mobileMessage) {
      mobileMessage.style.display = 'none';
    }
  },
  beforeUnmount() {
    const mobileMessage = document.querySelector('.mobile-message');
    if (mobileMessage) {
      mobileMessage.style.display = '';
    }
  },

  unmounted() {
    window.removeEventListener('keydown', this.handleDebugKeyDown)
  },

  methods: {
    toggleDebug() {
      this.debugMode = !this.debugMode
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
        altGr: event.altKey && event.ctrlKey, // AltGr envoie Alt+Ctrl
        ctrl: event.ctrlKey
      }
      this.addLog(`Debug - Touche: ${event.key}, Code: ${event.code}`)
    },

    logKeyPress(event) {
      this.addLog(`Touche pressée: ${event.key} à ${new Date(event.timestamp).toLocaleTimeString()}`)
    },

    logKeyRelease(event) {
      this.addLog(`Touche relâchée: ${event.key} à ${new Date(event.timestamp).toLocaleTimeString()}`)
    },

    addLog(message) {
      this.eventLogs.unshift(message)
      if (this.eventLogs.length > 10) {
        this.eventLogs.pop()
      }
    }
  }
}
</script>

<style scoped>
.keyboard-test {
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  padding: clamp(1rem, 2vw, 2rem);
}

h1 {
  color: var(--accent-color);
  margin-bottom: 2rem;
  font-size: 2rem;
  text-align: center;
}

.keyboard-container {
  background: var(--bg-secondary);
  padding: clamp(1rem, 2vw, 2rem);
  border-radius: clamp(0.5rem, 1vw, 1rem);
  box-shadow: 
    -8px -8px 20px -6px rgba(255, 255, 255, 0.05),
    8px 8px 20px -6px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.key-row {
  display: flex;
  flex-wrap: nowrap;
  gap: clamp(0.125rem, 0.25vw, 0.25rem);
  align-items: center;
  margin-bottom: clamp(0.125rem, 0.25vw, 0.25rem);
  justify-content: center;
  width: 100%;
  max-width: 100%;
}

.event-log {
  margin-top: 2rem;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  box-shadow: 
    -8px -8px 20px -6px rgba(255, 255, 255, 0.05),
    8px 8px 20px -6px rgba(0, 0, 0, 0.15);
}

.log-container {
  margin-top: 1.5rem;
  max-height: 200px;
  overflow-y: auto;
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 
    inset 2px 2px 5px rgba(0, 0, 0, 0.1),
    inset -2px -2px 5px rgba(255, 255, 255, 0.05);
}

.log-entry {
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-color);
  font-family: monospace;
  box-shadow: 
    2px 2px 5px rgba(0, 0, 0, 0.1),
    -2px -2px 5px rgba(255, 255, 255, 0.05);
}

.log-entry:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .keyboard-test {
    padding: 0.5rem;
  }

  .keyboard-container {
    padding: 0.5rem;
  }

  .key-row {
    gap: 0.125rem;
    margin-bottom: 0.125rem;
  }

  h1 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .keyboard-test {
    padding: 0.25rem;
  }

  .keyboard-container {
    padding: 0.25rem;
  }

  .key-row {
    gap: 0.0625rem;
    margin-bottom: 0.0625rem;
  }
}

.debug-controls {
  margin-bottom: 1rem;
  text-align: center;
}

.debug-button {
  padding: 0.5rem 1rem;
  background: var(--accent-color);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.debug-button:hover {
  background: var(--hover-color);
}

.debug-log {
  margin-top: 2rem;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  box-shadow: 
    -8px -8px 20px -6px rgba(255, 255, 255, 0.05),
    8px 8px 20px -6px rgba(0, 0, 0, 0.15);
}

.debug-info {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.debug-key-info {
  margin-top: 1rem;
  font-family: monospace;
}

.debug-key-info ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
}

.debug-key-info li {
  padding: 0.25rem 0;
}
</style> 