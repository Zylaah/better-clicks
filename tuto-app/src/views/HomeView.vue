<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-content">
        <h1>
          <div class="title-container">
            <span class="static-text">L'informatique</span>
            <div class="words-wrapper">
              <div class="words">
                <span>simple</span>
                <span>sécurisé</span>
                <span>pédago</span>
              </div>
            </div>
          </div>
        </h1>
        


        <p class="subtitle">Apprenez à utiliser votre ordinateur pas à pas, sans stress et à votre rythme.</p>
        <div class="cta-buttons">
          <router-link to="/keyboard" class="cta-button primary">
            <font-awesome-icon icon="graduation-cap" />
            Débuter l'apprentissage
          </router-link>
          <router-link to="/construction" class="cta-button secondary">
            <font-awesome-icon icon="book" />
            Guide du débutant
          </router-link>
        </div>
      </div>
    </div>

    <div class="features-section">
      <h2>Nos Modules d'Apprentissage</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <font-awesome-icon icon="desktop" />
          </div>
          <h3>Les Bases de Windows</h3>
          <p>Découvrez comment utiliser votre ordinateur : bureau, fichiers, programmes et paramètres essentiels</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <font-awesome-icon icon="globe" />
          </div>
          <h3>Internet et Navigation</h3>
          <p>A venir</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <font-awesome-icon icon="shield-halved" />
          </div>
          <h3>Sécurité Numérique</h3>
          <p>A venir</p>
        </div>
      </div>
    </div>

    <div class="latest-tutorials">
      <h2>Tutoriels Recommandés</h2>
      <div class="tutorials-grid">
        <router-link to="/file-tree" class="tutorial-card">
          <div class="tutorial-badge">Débutant</div>
          <div class="tutorial-content">
            <h3>L'arborescence des fichiers</h3>
            <p>Apprenez à naviguer dans une arborescence de fichiers</p>
            <div class="tutorial-meta">
              <span><font-awesome-icon icon="clock" /> 30 min</span>
              <span><font-awesome-icon icon="star" /> Pour débutants</span>
            </div>
          </div>
        </router-link>

        <router-link to="/keyboard" class="tutorial-card">
          <div class="tutorial-badge">Intermédiaire</div>
          <div class="tutorial-content">
            <h3>Découvrir le clavier</h3>
            <p>Apprenez à utiliser votre clavier comme un pro</p>
            <div class="tutorial-meta">
              <span><font-awesome-icon icon="clock" /> 45 min</span>
              <span><font-awesome-icon icon="keyboard" /> Pratique</span>
            </div>
          </div>
        </router-link>

        <div class="tutorial-card">
          <div class="tutorial-content">
            <h3>Se Connecter à Internet</h3>
            <p>Configurez votre connexion WiFi et naviguez sur le web en toute sécurité</p>
            <div class="tutorial-meta">
              <span><font-awesome-icon icon="clock" /> 1h</span>
              <span><font-awesome-icon icon="wifi" /> Essentiel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import { onBeforeMount, getCurrentInstance } from 'vue'

export default {
  name: 'HomeView',
  
  setup() {
    const { proxy: app } = getCurrentInstance()
    
    onBeforeMount(async () => {
      await Promise.all([
        app.$loadIcon('graduationCap'),
        app.$loadIcon('book'),
        app.$loadIcon('desktop'),
        app.$loadIcon('globe'),
        app.$loadIcon('shieldHalved'),
        app.$loadIcon('clock'),
        app.$loadIcon('star'),
        app.$loadIcon('keyboard'),
        app.$loadIcon('wifi')
      ])
    })
  }
}
</script>

<style scoped>
/* Base styles */
.home {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-color);
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: clamp(1rem, 5vw, 3rem);
  background: radial-gradient(circle at center, var(--hover-color) 0%, transparent 70%);
}

.hero-content {
  max-width: min(90%, 800px);
  margin: 0 auto;
}

h1 {
  color: var(--accent-color);
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin-bottom: clamp(0.5rem, 2vw, 1rem);
  font-weight: 700;
}

.subtitle {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--text-secondary);
  margin-bottom: clamp(1rem, 3vw, 2rem);
}

/* CTA Buttons */
.cta-buttons {
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  justify-content: center;
  margin-top: clamp(1rem, 3vw, 2rem);
  flex-wrap: wrap;
}

.cta-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem);
  border-radius: 8px;
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.cta-button.primary {
  background: var(--accent-color);
  color: white;
}

.cta-button.primary:hover {
  background: var(--link-hover);
  transform: translateY(-2px);
}

.cta-button.secondary {
  background: var(--hover-color);
  color: var(--text-color);
}

.cta-button.secondary:hover {
  background: var(--border-color);
  transform: translateY(-2px);
}

/* Features Section */
.features-section {
  padding: clamp(1rem, 3vw, 2rem) clamp(1rem, 3vw, 2rem);
  min-height: 40vh;
  background: var(--bg-secondary);
}

.features-section h2 {
  text-align: center;
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: clamp(1.5rem, 4vw, 3rem);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
  gap: clamp(1.5rem, 3vw, 2.5rem);
  max-width: min(95%, 1200px);
  margin: 0 auto;
}

.feature-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: clamp(1.5rem, 3vw, 2rem);
  height: 70%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border-color);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: clamp(2rem, 4vw, 2.5rem);
  color: var(--accent-color);
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.feature-card h3 {
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  margin-bottom: 1rem;
  color: var(--text-color);
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: clamp(0.9rem, 1.5vw, 1rem);
}

/* Ajustement pour le mode sombre */
@media (prefers-color-scheme: dark) {
  .feature-card {
    background: var(--bg-secondary);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }
  
  .feature-card:hover {
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .feature-card {
    text-align: center;
    padding: clamp(1.2rem, 2.5vw, 1.8rem);
  }
}

/* Latest Tutorials */
.latest-tutorials {
  padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem);
}

.latest-tutorials h2 {
  text-align: center;
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: clamp(1.5rem, 4vw, 3rem);
}

.tutorials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: clamp(1rem, 3vw, 2rem);
  max-width: min(95%, 1200px);
  margin: 0 auto;
}

.tutorial-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: clamp(1.5rem, 3vw, 2rem);
  height: 70%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border-color);
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.tutorial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.tutorial-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--accent-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.tutorial-content {
  padding-top: 1rem;
}

.tutorial-content h3 {
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  margin-bottom: 1rem;
  color: var(--text-color);
}

.tutorial-content p {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: clamp(0.9rem, 1.5vw, 1rem);
  margin-bottom: 1.5rem;
}

.tutorial-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: auto;
}

.tutorial-meta span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Ajustement pour le mode sombre */
@media (prefers-color-scheme: dark) {
  .tutorial-card {
    background: var(--bg-secondary);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }
  
  .tutorial-card:hover {
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
  }
  
  .tutorial-badge {
    background: var(--accent-color);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .tutorial-card {
    text-align: center;
    padding: clamp(1.2rem, 2.5vw, 1.8rem);
  }
  
  .tutorial-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .tutorial-badge {
    position: static;
    display: inline-block;
    margin-bottom: 1rem;
  }
}

/* Animation Optimizations */
@media (prefers-reduced-motion: reduce) {
  .feature-card:hover,
  .tutorial-card:hover,
  .cta-button:hover {
    transform: none;
    transition: none;
  }
}

/* Animation du texte rotatif */
.title-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.3rem;
  margin: 0 auto;
  width: fit-content;
}

.static-text {
  font-size: clamp(2rem, 5vw, 3.5rem);
  white-space: nowrap;
}

.words-wrapper {
  display: inline-block;
  font-size: clamp(2rem, 5vw, 3.5rem);
  height: 5rem;
  overflow: hidden;
  text-align: left;
}

.words {
  display: inline-block;
  color: var(--text-color);
  animation: slide 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  text-align: left;
  position: relative;
}

.words span {
  display: block;
  height: 4rem;
  padding: 1rem 0 1rem 0.5rem;
  text-align: left;
  white-space: nowrap;
  line-height: 1.2;
}

@keyframes slide {
  0%, 30% {
    transform: translateY(-3%);
  }
  33%, 63% {
    transform: translateY(-36.5%);
  }
  66%, 96% {
    transform: translateY(-70%);
  }
  99%, 100% {
    transform: translateY(-3%);
  }
}

</style>
