<template>
  <div class="keyboard-textarea-wrapper">
    <textarea 
      v-show="!isComplete"
      :value="modelValue"
      class="modern-textarea"
      :class="validationClasses"
      :placeholder="placeholder"
      rows="5"
      @input="onInput"
      @keydown.enter.prevent
    ></textarea>
    <div class="validation-message-container">
      <div v-show="message" class="validation-message" :class="validationClasses">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KeyboardTextArea',

  props: {
    modelValue: {
      type: String,
      required: true
    },
    isComplete: {
      type: Boolean,
      default: false
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    isIncorrect: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      required: true
    }
  },

  emits: ['update:modelValue', 'input'],

  computed: {
    validationClasses() {
      return {
        'correct': this.isCorrect,
        'incorrect': this.isIncorrect
      }
    }
  },

  methods: {
    onInput(event) {
      this.$emit('update:modelValue', event.target.value)
      this.$emit('input', event)
    }
  }
}
</script>

<style scoped>
.keyboard-textarea-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  contain: content;
  padding-inline: 1rem;
  max-width: 100%;
  box-sizing: border-box;
  padding-bottom: 2rem;
}

.modern-textarea {
  width: 100%;
  height: clamp(6rem, 10vh, 8rem);
  padding: 1rem;
  border: 2px solid var(--accent-color);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-color);
  font-size: 1.1rem;
  line-height: 1.5;
  resize: none;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  contain: content;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.modern-textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--accent-color-rgb), 0.3);
  border-color: var(--accent-color);
}

.modern-textarea::placeholder {
  color: rgba(var(--text-color-rgb), 0.5);
}

.validation-message-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2rem; /* Hauteur fixe pour le message */
  display: flex;
  justify-content: center;
  align-items: center;
}

.validation-message {
  margin-block-start: clamp(0.25rem, 0.5vh, 0.5rem);
  text-align: center;
  color: var(--accent-color);
  font-size: 0.9rem;
  contain: content;
}

.validation-message.correct {
  color: var(--accent-color);
}

.validation-message.incorrect {
  color: #f44336;
}

.modern-textarea.correct {
  border-color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.05);
}

.modern-textarea.incorrect {
  border-color: #f44336;
  background-color: rgba(244, 67, 54, 0.05);
}
</style> 