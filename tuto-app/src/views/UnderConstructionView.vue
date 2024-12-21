<template>
  <div class="construction-container">
    <div class="construction-content">
      <!-- Icône animée -->
      <div class="icon-container">
        <div class="loader">
            <div class="box box-1">
                <div class="side-left"></div>
                <div class="side-right"></div>
                <div class="side-top"></div>
            </div>
            <div class="box box-2">
                <div class="side-left"></div>
                <div class="side-right"></div>
                <div class="side-top"></div>
            </div>
            <div class="box box-3">
                <div class="side-left"></div>
                <div class="side-right"></div>
                <div class="side-top"></div>
            </div>
            <div class="box box-4">
                <div class="side-left"></div>
                <div class="side-right"></div>
                <div class="side-top"></div>
            </div>
        </div>
      </div>

      <!-- Texte -->
      <h1>Page en Construction</h1>
      <p>Cette fonctionnalité arrive bientôt !</p>
      
      <!-- Barre de progression 
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div> -->

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
  padding: 0;
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
  height: 80px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
    scale: 2;
    height: 50px;
    width: 40px;
    position: relative;
    left: 0;
}   

.box {
  position: relative;
  opacity: 0;
  left: 10px;
}

.side-left {
  position: absolute;
  background-color: #3a8f69;
  width: 19px;
  height: 5px;
  transform: skew(0deg, -25deg);
  top: 14px;
  left: 10px;
}

.side-right {
  position: absolute;
  background-color: #46ad7f;
  width: 19px;
  height: 5px;
  transform: skew(0deg, 25deg);
  top: 14px;
  left: -9px;
}

.side-top {
  position: absolute;
  background-color: var(--accent-color);
  width: 20px;
  height: 20px;
  rotate: 45deg;
  transform: skew(-20deg, -20deg);
}

.box-1 {
  animation: from-left 4s infinite;
}

.box-2 {
  animation: from-right 4s infinite;
  animation-delay: 1s;
}

.box-3 {
  animation: from-left 4s infinite;
  animation-delay: 2s;
}

.box-4 {
  animation: from-right 4s infinite;
  animation-delay: 3s;
}

@keyframes from-left {
  0% {
    z-index: 20;
    opacity: 0;
    translate: -20px -6px;
  }

  20% {
    z-index: 10;
    opacity: 1;
    translate: 0px 0px;
  }

  40% {
    z-index: 9;
    translate: 0px 4px;
  }

  60% {
    z-index: 8;
    translate: 0px 8px;
  }

  80% {
    z-index: 7;
    opacity: 1;
    translate: 0px 12px;
  }

  100% {
    z-index: 5;
    translate: 0px 30px;
    opacity: 0;
  }
}

@keyframes from-right {
  0% {
    z-index: 20;
    opacity: 0;
    translate: 20px -6px;
  }

  20% {
    z-index: 10;
    opacity: 1;
    translate: 0px 0px;
  }

  40% {
    z-index: 9;
    translate: 0px 4px;
  }

  60% {
    z-index: 8;
    translate: 0px 8px;
  }

  80% {
    z-index: 7;
    opacity: 1;
    translate: 0px 12px;
  }

  100% {
    z-index: 5;
    translate: 0px 30px;
    opacity: 0;
  }
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
