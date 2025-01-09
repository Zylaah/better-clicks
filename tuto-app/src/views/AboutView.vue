<template>
  <div class="about-container">
    <div class="about-header">
      <div class="header-content">
        <h1>À propos de <span class="accent">Numérix</span></h1>
        <p class="subtitle">Une nouvelle approche de l'apprentissage numérique</p>
        <div class="header-badges">
          <span class="version-badge">Version 0.2.0</span>
          <span class="status-badge">Beta</span>
        </div>
      </div>
    </div>

    <div class="mission-section">
      <div class="mission-content">
        <h2>Notre Mission</h2>
        <p>Faciliter l'apprentissage de l'informatique de manière interactive et ludique, rendant accessible à tous les concepts fondamentaux du numérique.</p>
      </div>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="card-header">
          <font-awesome-icon icon="graduation-cap" class="card-icon" />
          <h3>Apprentissage Progressif</h3>
        </div>
        <p>Une approche étape par étape pour maîtriser l'informatique et le numérique.</p>
        <ul class="feature-list">
          <li>Exercices pratiques</li>
          <li>Progression personnalisée</li>
          <li>Feedback instantané</li>
        </ul>
      </div>

      <div class="feature-card">
        <div class="card-header">
          <font-awesome-icon icon="wand-magic-sparkles" class="card-icon" />
          <h3>Interface Intuitive</h3>
        </div>
        <p>Une expérience utilisateur fluide et agréable pour un apprentissage sans stress.</p>
        <ul class="feature-list">
          <li>Design moderne</li>
          <li>Navigation simple</li>
          <li>Mode sombre/clair</li>
        </ul>
      </div>

      <div class="feature-card">
        <div class="card-header">
          <font-awesome-icon icon="shield-halved" class="card-icon" />
          <h3>Sécurité & Fiabilité</h3>
        </div>
        <p>Un environnement sûr pour apprendre et pratiquer en toute confiance.</p>
        <ul class="feature-list">
          <li>Pas besoin de connexion internet</li>
          <li>Mises à jour régulières</li>
          <li>Support technique</li>
        </ul>
      </div>
    </div>

    <div class="tech-section">
      <h2>Technologies</h2>
      <div class="tech-stack">
        <div class="tech-item">
          <img src="@/assets/vue.svg" alt="Vue.js" class="tech-logo" />
          <span>Vue.js 3</span>
        </div>
        <div class="tech-item">
          <img src="@/assets/electron.svg" alt="Electron" class="tech-logo" />
          <span>Electron</span>
        </div>
        <div class="tech-item">
          <img src="@/assets/javascript.svg" alt="JavaScript" class="tech-logo" />
          <span>JavaScript</span>
        </div>
      </div>
    </div>

    <div class="contact-section">
      <div class="contact-content">
        <h2>Restons connectés</h2>
        <div class="contact-links">
          <a href="mailto:conseil.numerique@cotedor.fr" class="contact-link email">
            <font-awesome-icon icon="envelope" />
            <span>conseil.numerique@cotedor.fr</span>
          </a>
          <a href="https://github.com/Zylaah/better-clicks" target="_blank" class="contact-link github">
            <font-awesome-icon :icon="['fab', 'github']" />
            <span>GitHub</span>
          </a>
          <a href="https://twitter.com/numerix" target="_blank" class="contact-link twitter">
            <font-awesome-icon :icon="['fab', 'twitter']" />
            <span>Twitter</span>
          </a>
        </div>
      </div>
    </div>

    <footer class="about-footer">
      <p>© 2024 Numérix. Tous droits réservés.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'AboutView',
  mounted() {
    const mobileMessage = document.querySelector('.mobile-message');
    if (mobileMessage) {
      mobileMessage.style.display = 'none';
    }
  },
  beforeUnmount() {
    const mobileMessage = document.querySelector('.mobile-message');
    if (mobileMessage) {
      mobileMessage.style.display = '';
    }
  }
}
</script>

<style scoped>
.about-container {
  max-width: min(95%, 1400px);
  margin: 0 auto;
  padding: clamp(1rem, 5vh, 3rem);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 5vh, 4rem);
}

.about-header {
  text-align: center;
  padding: clamp(2rem, 6vh, 4rem) 0;
  background: radial-gradient(circle at center, var(--accent-color-transparent) 0%, transparent 70%);
  border-radius: 2rem;
  margin-bottom: -1rem;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.about-header h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin-bottom: 1rem;
  color: var(--text-color);
}

.accent {
  color: var(--accent-color);
  position: relative;
}

.subtitle {
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.header-badges {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.version-badge, .status-badge {
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.version-badge {
  background: var(--accent-color);
  color: white;
}

.status-badge {
  background: var(--bg-secondary);
  color: var(--accent-color);
  border: 1px solid var(--accent-color);
}

.mission-section {
  text-align: left;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 2rem 2rem;
  background: var(--bg-secondary);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.mission-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--accent-color-transparent) 0%, transparent 100%);
  opacity: 0.1;
  z-index: 0;
}

.mission-content {
  position: relative;
  z-index: 1;
}

.mission-section h2 {
  color: var(--accent-color);
  font-size: clamp(1.8rem, 3vw, 2.2rem);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mission-section h2::before {
  content: '✨';
  font-size: 1.8rem;
}

.mission-section p {
  color: var(--text-color);
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  line-height: 1.6;
  margin: 0;
  position: relative;
  padding-left: 1.5rem;
  border-left: 3px solid var(--accent-color);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

.feature-card {
  background: var(--bg-secondary);
  padding: clamp(1.5rem, 3vw, 2rem);
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: var(--accent-color);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.card-icon {
  font-size: 1.5rem;
  color: var(--accent-color);
}

.feature-card h3 {
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  color: var(--text-color);
  margin: 0;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.feature-list li {
  padding-left: 1.5rem;
  position: relative;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.feature-list li::before {
  content: "→";
  color: var(--accent-color);
  position: absolute;
  left: 0;
}

.tech-section {
  text-align: center;
  padding: 3rem 0;
}

.tech-section h2 {
  color: var(--accent-color);
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: 2rem;
}

.tech-stack {
  display: flex;
  justify-content: center;
  gap: clamp(2rem, 5vw, 4rem);
  flex-wrap: wrap;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.tech-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  filter: var(--icon-filter);
  transition: transform 0.3s ease;
}

.tech-item:hover .tech-logo {
  transform: scale(1.1);
}

.tech-item span {
  color: var(--text-color);
  font-weight: 500;
}

.contact-section {
  background: var(--bg-secondary);
  padding: clamp(2rem, 5vh, 4rem);
  border-radius: 1rem;
  text-align: center;
}

.contact-section h2 {
  color: var(--accent-color);
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: 2rem;
}

.contact-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: var(--text-color);
  background: var(--bg-primary);
  transition: all 0.3s ease;
}

.contact-link:hover {
  transform: translateY(-2px);
  background: var(--accent-color);
  color: white;
}

.about-footer {
  text-align: center;
  color: var(--text-secondary);
  margin-top: auto;
  padding-top: 2rem;
}

p {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .about-container {
    gap: 3rem;
  }

  .contact-links {
    flex-direction: column;
  }

  .contact-link {
    justify-content: center;
  }

  .about-header {
    margin-top: 5rem;
  }
}

@media (max-width: 480px) {
  .about-header {
    padding: 2rem 1rem;
  }

  .tech-stack {
    gap: 2rem;
  }
}
</style>
