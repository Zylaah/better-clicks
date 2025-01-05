<template>
    <div v-if="isVisible" class="onboarding-overlay">
      <div class="onboarding-content">
        <h2>Bienvenue dans les exercices de frappe</h2>
        
        <div class="onboarding-steps">
          <div class="step">
            <font-awesome-icon icon="keyboard" class="step-icon" />
            <h3>Clavier Interactif</h3>
            <p>Le clavier virtuel s'illumine en temps réel pour vous guider dans vos frappes. Les touches à presser sont mises en évidence.</p>
          </div>
          
          <div class="step">
            <font-awesome-icon icon="check" class="step-icon" />
            <h3>Validation Instantanée</h3>
            <p>Vos frappes sont validées instantanément. Les touches correctes s'affichent en vert, les erreurs en rouge.</p>
          </div>

          <div class="step">
            <font-awesome-icon icon="graduation-cap" class="step-icon" />
            <h3>Progression Adaptée</h3>
            <p>Commencez par des lettres simples, puis progressez vers des mots et des phrases complètes.</p>
          </div>

          <div class="step">
            <font-awesome-icon icon="lightbulb" class="step-icon" />
            <h3>Conseils</h3>
            <p>Gardez vos doigts sur la ligne de repos (AZER). Regardez l'écran plutôt que vos doigts pour progresser.</p>
          </div>
        </div>
  
        <button class="start-button" @click="closeOnboarding">
          Commencer l'apprentissage
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'KeyboardOnboarding',
    data() {
      return {
        isVisible: false
      }
    },
    methods: {
      closeOnboarding() {
        this.isVisible = false
        localStorage.setItem('keyboard-onboarding-shown', 'true')
      }
    },
    mounted() {
      const hasSeenOnboarding = localStorage.getItem('keyboard-onboarding-shown')
      if (!hasSeenOnboarding) {
        this.isVisible = true
      }
    }
  }
  </script>
  
  <style scoped>
  .onboarding-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  }
  
  .onboarding-content {
    background: var(--bg-secondary);
    padding: 2rem;
    border-radius: 12px;
    max-width: 600px;
    width: 90%;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
  
  .onboarding-content h2 {
    color: var(--accent-color);
    margin-bottom: 2rem;
    font-size: 1.8rem;
  }
  
  .onboarding-steps {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin: 2rem 0;
    max-width: 800px;
    margin: 2rem auto;
  }
  
  .step {
    background: var(--bg-primary);
    padding: 1.5rem;
    border-radius: 8px;
    transition: transform 0.2s ease;
  }
  
  .step:hover {
    transform: translateY(-2px);
  }
  
  .step-icon {
    font-size: 2rem;
    color: var(--accent-color);
    margin-bottom: 1rem;
  }
  
  .step h3 {
    color: var(--text-color);
    margin-bottom: 0.5rem;
  }
  
  .step p {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
  
  .start-button {
    background: var(--accent-color);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  
  .start-button:hover {
    transform: translateY(-2px);
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @media (max-width: 768px) {
    .onboarding-steps {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
  </style>