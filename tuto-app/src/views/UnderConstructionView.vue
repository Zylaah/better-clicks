<template>
  <div class="construction-container">
    <div class="construction-content">
      <!-- Icône animée -->
      <div class="icon-container">
        <font-awesome-icon icon="hard-hat" class="construction-icon primary-icon" />
        <font-awesome-icon icon="tools" class="construction-icon secondary-icon" />
      </div>

      <!-- Texte -->
      <h1>Page en Construction</h1>
      <p>Cette fonctionnalité arrive bientôt !</p>
      
      <!-- Barre de progression -->
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>

      <!-- Bouton de retour -->
      <button class="back-button" @click="$router.push('/')">
        <font-awesome-icon icon="arrow-left" /> 
        Retour à l'accueil
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UnderConstructionView'
}
</script>

<style scoped>
.construction-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--bg-primary);
}

.construction-content {
  text-align: center;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 0 4px 6px var(--shadow-color);
  max-width: 500px;
  width: 100%;
}

.icon-container {
  position: relative;
  height: 60px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.construction-icon {
  font-size: 3rem;
  color: var(--accent-color);
}

.primary-icon {
  animation: bounce 2s infinite;
}

.secondary-icon {
  position: absolute;
  left: 55%;
  animation: rotate 3s infinite;
}

h1 {
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: clamp(1.5rem, 3vw, 2rem);
}

p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: clamp(1rem, 2vw, 1.2rem);
}

.progress-bar {
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
  margin: 2rem 0;
}

.progress-fill {
  height: 100%;
  background: var(--accent-color);
  width: 30%;
  animation: progress 2s ease-in-out infinite;
}

.back-button {
  padding: 0.8rem 1.5rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
  transition: transform 0.2s ease;
}

.back-button:hover {
  transform: translateY(-2px);
}

/* Animations */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

/* Media Queries */
@media (max-width: 768px) {
  .construction-content {
    padding: 1.5rem;
  }
}
</style>
