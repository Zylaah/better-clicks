<template>
  <div class="container">
    <KeyboardOnboarding />

    <div class="exercises-container fade">
      <h2 class="exercises-title">Exercices de frappe au clavier</h2>
      <div class="exercises-grid">
        <div 
          v-for="(exercise, index) in exercises" 
          :key="index"
          class="card"
          @click="navigateToExercise(exercise.route)"
        >
          <strong>{{ exercise.title }}</strong>
          <div class="card_body">
            <p>{{ exercise.difficulty }}</p>
          </div>
          <span>Commencer</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import KeyboardOnboarding from '@/components/onboarding/KeyboardOnboarding.vue'

export default {
  name: 'KeyboardExerciseMenu',
  components: {
    KeyboardOnboarding
  },
  
  data() {
    return {
      exercises: [
        {
          title: "Découvrir les touches lettres et chiffres",
          difficulty: "Débutant",
          route: "keyboard-lettre"
        },
        {
          title: "symboles et accents",
          difficulty: "Intermédiaire",
          route: "keyboard-symboles"
        },
        {
          title: "Taper des mots",
          difficulty: "Débutant",
          route: "keyboard-mots"
        },
        {
          title: "Taper des phrases",
          difficulty: "Avancé",
          route: "keyboard-phrase"
        }
      ]
    }
  },

  methods: {
    navigateToExercise(route) {
      this.$router.push({ name: route })
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
}

.keyboard-3d-wrapper {
  width: min(95%, 60vw);
  margin-top: clamp(2rem, 4vh, 4rem);
}

h2 {
  font-size: 2rem;
  margin-top: 2rem;
}

.exercises-container {
  width: min(95%, 60vw);
  padding: clamp(1rem, 4vh, 2rem) clamp(1rem, 3vw, 3rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
}

.exercises-title {
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  margin-bottom: clamp(0.2rem, 3vw, 1rem);
  margin-top: clamp(4rem, 6rem, 8rem);
  text-align: center;
  color: var(--accent-color);
}

.exercises-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: clamp(1rem, 2vw, 2rem);
  width: 100%;
  max-width: 1200px;
  margin: 1.5rem auto;
  padding: 0 1rem;
}

.card {
  position: relative;
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-color);
  overflow: hidden;
  cursor: pointer;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(var(--accent-color-rgb), 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--accent-color);
}

.card:hover::before {
  opacity: 1;
}

.card strong {
  font-size: clamp(1.1rem, 1.8vw, 1.3rem);
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.8rem;
  position: relative;
  z-index: 1;
}

.card_body {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 2;
}

.card_body p {
  display: inline-block;
  background: var(--accent-color);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0;
}

.card span {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  color: var(--accent-color);
  font-weight: 600;
  font-size: 1rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  z-index: 2;
}

.card:hover span {
  opacity: 1;
  transform: translateY(0);
}

/* Animation */
.fade {
  animation: fade 0.3s ease-in-out;
}

@keyframes fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Media queries */
@media (max-width: 768px) {
  .exercises-grid {
    grid-template-columns: 1fr;
  }

  .card {
    min-height: 180px;
  }
}

@media (max-height: 816px) {
  .container {
    scale: 0.8;
  }
  .exercises-title {
    margin-top: 2rem;
  }
}

@media (max-width: 1180px) {
  .container {
    display: none;
  }
}
</style>