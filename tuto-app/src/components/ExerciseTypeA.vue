<template>
    <div class="exercise-content">
      <h3>{{ exercise.title }}</h3>
      <p>{{ exercise.description }}</p>
      <!-- Ajoutez ici la logique spécifique à l'exercice -->
      <div class="exercise-task">
        <p>Votre tâche : {{ exercise.task }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['exercise']
  }
  </script>
  
  <style scoped>
  .exercise-content {
    padding: 20px;
    background-color: var(--bg-secondary);
    border-radius: 8px;
    box-shadow: 0 2px 4px var(--shadow-color);
  }
  
  .exercise-task {
    margin-top: 20px;
    padding: 10px;
    background-color: var(--bg-primary);
    border-radius: 5px;
    color: var(--text-color);
  }
  </style>