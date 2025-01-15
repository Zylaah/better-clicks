<template>
  <div class="textarea-container">
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

    <div v-show="message" class="validation-message" :class="validationClasses">
      {{ message }}
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
.textarea-container {
  display: flex;
  padding: 1rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
}

.modern-textarea {
  width: 100%;
  height: clamp(3rem, 5vh, 6rem);
  padding: 1rem;
  border: 2px solid var(--accent-color);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-color);
  font-size: 1.1rem;
  line-height: 1.5;
  resize: none;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.modern-textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--accent-color-rgb), 0.3);
  border-color: var(--accent-color);
}

.modern-textarea::placeholder {
  color: rgba(var(--text-color-rgb), 0.5);
}

.validation-message {
  margin-top: clamp(0.25rem, 0.5vh, 0.5rem);
  text-align: center;
  color: var(--accent-color);
  font-size: 0.9rem;
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