<template>
  <div class="keyboard-textarea-wrapper">
    <textarea 
      ref="textareaRef"
      v-show="!isComplete"
      :value="modelValue"
      class="modern-textarea"
      :class="validationClasses"
      :placeholder="placeholder"
      rows="5"
      @input="onInput"
      @compositionstart="onCompositionStart"
      @compositionend="onCompositionEnd"
      @keydown.enter.prevent="onEnterPress"
    ></textarea>
    <div class="validation-message-container">
      <div 
        v-show="message" 
        class="validation-message" 
        :class="validationClasses"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue'

export default defineComponent({
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

  emits: ['update:modelValue', 'input', 'enter'],

  setup(props, { emit }) {
    const textareaRef = ref(null)
    const inputBuffer = ref('')
    const lastInputTime = ref(0)
    const isComposing = ref(false)
    const inputThrottle = 16 // ~60fps

    // Optimisation du rendu des classes
    const validationClasses = computed(() => ({
      'correct': props.isCorrect,
      'incorrect': props.isIncorrect
    }))

    // Gestion optimisée de l'input avec throttling
    const processInput = (event) => {
      const now = performance.now()
      if (now - lastInputTime.value < inputThrottle) {
        return
      }
      
      lastInputTime.value = now
      const value = event.target.value
      
      // Mise à jour du buffer local
      inputBuffer.value = value
      
      // Émission des événements
      emit('update:modelValue', value)
      emit('input', event)
    }

    const onInput = (event) => {
      if (isComposing.value) return
      processInput(event)
    }

    const onCompositionStart = () => {
      isComposing.value = true
    }

    const onCompositionEnd = (event) => {
      isComposing.value = false
      processInput(event)
    }

    const onEnterPress = () => {
      if (props.isCorrect) {
        emit('enter')
        // Réinitialiser l'état du textarea
        if (textareaRef.value) {
          textareaRef.value.value = ''
        }
        emit('update:modelValue', '')
      }
    }

    // Optimisation du focus
    onMounted(() => {
      if (textareaRef.value) {
        textareaRef.value.focus()
      }
    })

    // Surveiller les changements de modelValue pour synchroniser le textarea
    watch(() => props.modelValue, (newValue) => {
      if (textareaRef.value && textareaRef.value.value !== newValue) {
        textareaRef.value.value = newValue
      }
    })

    return {
      textareaRef,
      validationClasses,
      onInput,
      onCompositionStart,
      onCompositionEnd,
      onEnterPress
    }
  }
})
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
  padding-bottom: 3rem;
  will-change: transform;
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
  will-change: transform;
  backface-visibility: hidden;
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
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  contain: content;
}

.validation-message {
  margin-block-start: clamp(0.25rem, 0.5vh, 0.5rem);
  text-align: center;
  color: var(--accent-color);
  font-size: 0.9rem;
  contain: content;
  will-change: transform, opacity;
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

/* Optimisations pour les appareils à faible puissance */
@media (prefers-reduced-motion: reduce) {
  .modern-textarea,
  .validation-message {
    transition: none;
  }
}
</style> 