<template>
    <div 
      v-if="show" 
      class="context-menu" 
      :style="{ top: position.y + 'px', left: position.x + 'px' }"
    >
      <ul>
        <li v-if="isFolder" @click="$emit('action', 'newFile')">
          <font-awesome-icon icon="file" /> Nouveau fichier
        </li>
        <li v-if="isFolder" @click="$emit('action', 'newFolder')">
          <font-awesome-icon icon="folder" /> Nouveau dossier
        </li>
        <li @click="$emit('action', 'rename')">
          <font-awesome-icon icon="edit" /> Renommer
        </li>
        <li @click="$emit('action', 'delete')" class="delete">
          <font-awesome-icon icon="trash" /> Supprimer
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ContextMenu',
    props: {
      show: Boolean,
      position: Object,
      isFolder: Boolean
    }
  }
  </script>
  
  <style scoped>
  .context-menu {
    position: fixed;
    background: #2d2d2d;
    border: 1px solid #3c3c3c;
    border-radius: 4px;
    padding: 5px 0;
    min-width: 200px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    z-index: 1000;
  }
  
  .context-menu ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .context-menu li {
    padding: 8px 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #e1e1e1;
  }
  
  .context-menu li:hover {
    background-color: #3c3c3c;
  }
  
  .context-menu li.delete {
    color: #ff6b6b;
  }
  
  .context-menu svg {
    width: 14px;
  }
  </style>