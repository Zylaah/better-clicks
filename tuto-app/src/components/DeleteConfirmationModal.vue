<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirmation de suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer "{{ itemName }}" ?</p>
        <div class="modal-actions">
          <button @click="$emit('confirm')" class="confirm-btn">Supprimer</button>
          <button @click="$emit('cancel')" class="cancel-btn">Annuler</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  name: 'DeleteConfirmationModal',
  emits: ['confirm', 'cancel'],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    itemName: {
      type: String,
      required: true
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: var(--bg-primary);
  padding: clamp(1rem, 2vw, 2rem);
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 10000;
  animation: menuAppear 0.1s ease forwards;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.modal-content h3 {
  margin-top: 0;
  color: var(--text-color);
  font-size: clamp(1.2rem, 2vw, 1.5rem);
}

.modal-content p {
  margin: 16px 0;
  color: var(--text-color);
  font-size: clamp(0.9rem, 1.5vw, 1rem);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: clamp(0.9rem, 1.5vw, 1rem);
  transition: background-color 0.2s;
}

.confirm-btn {
  background-color: var(--error-color);
  color: white;
}

.confirm-btn:hover {
  background-color: #c82333;
}

.cancel-btn {
  background-color: var(--button-background);
  color: var(--text-color);
}

.cancel-btn:hover {
  background-color: var(--bg-tertiary);
}

@keyframes menuAppear {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-content {
    animation: none;
  }
  
  button {
    transition: none;
  }
}
</style>