<template>
    <Teleport to="body">
        <Transition name="modal">
    <div v-if="modelValue" class="modal-overlay">
      <div class="modal-content">
        <h3>Renommer</h3>
        <input 
          v-model="newName" 
          ref="inputField"
          @keyup.enter="confirm"
          @keyup.esc="cancel"
        >
        <div class="modal-actions">
          <button @click="confirm">Confirmer</button>
          <button @click="cancel">Annuler</button>
        </div>
      </div>
    </div>
        </Transition>
    </Teleport>
  </template>
  
  <script>
  export default {
    props: {
        modelValue: {
            type: Boolean,
            required: true
    },
        initialName: {
            type: String,
            required: true
      }
    },
    data() {
        return {
            newName: ''
        };
    },
    watch: {
        modelValue(newVal) {
            if (newVal) {
                this.newName = this.initialName;
                this.$nextTick(() => {
                    this.$refs.inputField?.focus();
                });
                document.body.classList.add('modal-open');
            } else {
                document.body.classList.remove('modal-open');
        }
      }
    },
    methods: {
        confirm() {
            if (this.newName.trim()) {
                this.$emit('update:modelValue', false);
                this.$emit('confirm', this.newName);
  }
        },
        cancel() {
            this.$emit('update:modelValue', false);
        }
    },
    unmounted() {
        document.body.classList.remove('modal-open');
    }
};
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
    transform: none !important;
    pointer-events: all;
    user-select: none;
  }
  
:global(body.modal-open) {
    pointer-events: none;
}

:global(.modal-overlay *) {
    pointer-events: auto;
}

  .modal-content {
    background-color: var(--bg-secondary);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 90%;
    width: 400px;
}
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 15px;
  }
  
  button {
    padding: 6px 12px;
    border-radius: 4px;
    border: none;
    background: var(--button-background);
    color: var(--text-color);
    cursor: pointer;
  }
  
  button:hover {
    background: var(--button-hover);
  }

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.1s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
  </style>