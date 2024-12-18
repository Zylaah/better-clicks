<template>
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
  </template>
  
  <script>
  export default {
    name: 'DeleteConfirmationModal',
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
    z-index: 1000;
  }
  
  .modal-content {
    background-color: var(--bg-primary);
    padding: 20px;
    border-radius: 8px;
    min-width: 300px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  .modal-content h3 {
    margin-top: 0;
    color: var(--text-color);
  }
  
  .modal-content p {
    margin: 16px 0;
    color: var(--text-color);
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
    font-size: 14px;
    transition: background-color 0.2s;
  }
  
  .confirm-btn {
    background-color: #dc3545;
    color: white;
  }
  
  .confirm-btn:hover {
    background-color: #c82333;
  }
  
  .cancel-btn {
    background-color: #6c757d;
    color: white;
  }
  
  .cancel-btn:hover {
    background-color: #5a6268;
  }
  </style>