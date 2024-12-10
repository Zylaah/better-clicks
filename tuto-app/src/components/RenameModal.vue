<template>
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
  </template>
  
  <script>
  export default {
    props: {
      modelValue: Boolean,
      initialName: String
    },
    data() {
      return {
        newName: ''
      }
    },
    watch: {
      modelValue(val) {
        if (val) {
          this.newName = this.initialName
          this.$nextTick(() => {
            this.$refs.inputField?.focus()
          })
        }
      }
    },
    methods: {
      confirm() {
        if (this.newName.trim()) {
          this.$emit('update:modelValue', false)
          this.$emit('confirm', this.newName)
        }
      },
      cancel() {
        this.$emit('update:modelValue', false)
      }
    }
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: var(--bg-primary);
    padding: 20px;
    border-radius: 4px;
    min-width: 300px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    margin: 10px 0;
    background: var(--input-background);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    border-radius: 4px;
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
  </style>