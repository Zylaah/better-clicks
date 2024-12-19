<template>
  <div class="about-container">
    <div class="about-main-content">
      <div class="about-header">
        <h1>À propos de Numérix</h1>
        <p class="subtitle">Une plateforme d'apprentissage interactive !</p>
      </div>

      <div class="content-grid">
        <div class="info-card mission">
          <font-awesome-icon icon="bullseye" class="card-icon" />
          <h2>Notre Mission</h2>
          <p>Faciliter l'apprentissage de la gestion de fichiers et de dossiers de manière interactive et ludique, rendant accessible à tous les concepts fondamentaux de l'organisation numérique.</p>
        </div>

        <div class="info-card features">
          <font-awesome-icon icon="star" class="card-icon" />
          <h2>Fonctionnalités</h2>
          <ul>
            <li>Interface intuitive d'exploration de fichiers</li>
            <li>Exercices pratiques interactifs</li>
            <li>Progression personnalisée</li>
            <li>Mode sombre/clair adaptatif</li>
          </ul>
        </div>

        <div class="info-card tech">
          <font-awesome-icon icon="code" class="card-icon" />
          <h2>Technologies</h2>
          <div class="tech-stack">
            <span class="tech-badge">Vue.js 3</span>
            <span class="tech-badge">Vue Router</span>
            <span class="tech-badge">JavaScript ES6+</span>
            <span class="tech-badge">CSS3</span>
          </div>
        </div>

        <div class="info-card team">
          <font-awesome-icon icon="users" class="card-icon" />
          <h2>L'équipe</h2>
          <p>Développé avec passion par une équipe dédiée à l'amélioration de l'expérience d'apprentissage numérique.</p>
        </div>
      </div>
    </div>

    <div class="about-footer">
      <div class="contact-section">
        <h2>Nous Contacter</h2>
        <div class="contact-links">
          <a href="mailto:contact@numerix.com" class="contact-link">
            <font-awesome-icon icon="envelope" />
            <span>Email</span>
          </a>
          <a href="https://github.com/numerix" target="_blank" class="contact-link">
            <font-awesome-icon :icon="['fab', 'github']" />
            <span>GitHub</span>
          </a>
          <a href="https://twitter.com/numerix" target="_blank" class="contact-link">
            <font-awesome-icon :icon="['fab', 'twitter']" />
            <span>Twitter</span>
          </a>
        </div>
      </div>

      <div class="version-info">
          <p>Version 0.1.1</p>
          <p>© 2024 Numérix. Tous droits réservés.</p>
      </div>
    </div>  

  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: max(13vh, 4rem) auto 0;
  padding: 0 clamp(0.5rem, 0.5vw, 1rem) clamp(0.5rem, 0.5vw, 1rem);
}

.about-main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

.about-header {
  text-align: center;
  margin-bottom: clamp(1rem, 2vw, 2rem);
}

.about-header h1 {
  color: var(--accent-color);
  font-size: 2.5em;
  margin-bottom: clamp(0.5rem, 0.5vw, 1rem);
}

.subtitle {
  color: var(--text-secondary);
  font-size: clamp(0.9rem, 1.5vw, 1rem);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(1rem, 2vw, 2rem);
  margin-bottom: clamp(1rem, 2vw, 2rem);
}

.info-card {
  background: var(--bg-secondary);
  padding: clamp(1rem, 2vw, 2rem) clamp(1rem, 2vw, 2rem) clamp(1rem, 2vw, 2rem);
  border-radius: 15px;
  box-shadow: 0 4px 6px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px var(--shadow-color);
}

.card-icon {
  font-size: 2em;
  color: var(--accent-color);
  margin-bottom: clamp(0.5rem, 0.5vw, 1rem);
}

.info-card h2 {
  color: var(--text-color);
  margin-bottom: clamp(0.5rem, 0.5vw, 1rem);
  font-size: clamp(0.9rem, 1.5vw, 1rem);
}

.info-card p, .info-card li {
  color: var(--text-secondary);
  line-height: 1.6;
}

.info-card ul {
  list-style-type: none;
  padding: 0;
}

.info-card li {
  margin-bottom: clamp(0.5rem, 0.5vw, 1rem);
  padding-left: clamp(0.5rem, 0.5vw, 1rem);
  position: relative;
}

.info-card li::before {
  content: "•";
  color: var(--accent-color);
  position: absolute;
  left: 0;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(0.5rem, 0.5vw, 1rem);
}

.tech-badge {
  background: var(--accent-color);
  color: white;
  padding: clamp(0.5rem, 0.5vw, 1rem) clamp(1rem, 2vw, 2rem);
  border-radius: 15px;
  font-size: clamp(0.8rem, 1.5vw, 0.9em);
}

.contact-section {
  text-align: center;
  margin: max(20vh, 4rem) 0 0 0;
  background-color: var(--bg-secondary);
  padding: clamp(0.5rem, 0.5vw, 1rem) clamp(1rem, 2vw, 2rem);
  border-radius: 15px;
}

.contact-section h2 {
  color: var(--accent-color);
  margin-bottom: clamp(1rem, 2vw, 2rem);
  margin-top: 0;
  font-size: clamp(1.5rem, 2vw, 2em);
}

.contact-links {
  display: flex;
  justify-content: center;
  gap: clamp(0.5rem, 0.5vw, 1rem);
  margin-top: clamp(0.5rem, 0.5vw, 1rem);
}

.contact-link {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 0.5vw, 1rem);
  color: var(--text-color);
  text-decoration: none;
  padding: clamp(0.5rem, 0.5vw, 1rem) clamp(1rem, 2vw, 2rem);
  border-radius: clamp(0.5rem, 0.5vw, 1rem);
  transition: all 0.3s ease;
}

.contact-link:hover {
  background: var(--hover-color);
  color: var(--accent-color);
}

.version-info {
  text-align: center;
  color: var(--text-secondary);
  margin-top: clamp(1rem, 2vw, 2rem);
  padding-bottom: clamp(0.5rem, 0.5vw, 1rem);
  font-size: clamp(0.8rem, 1.5vw, 0.9em);
}

@media (max-width: 768px) {
  .about-container {
    margin-top: clamp(1rem, 2vw, 2rem);
  }

  .about-header h1 {
    font-size: clamp(1.5rem, 2vw, 2em);
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .contact-links {
    flex-direction: column;
    gap: clamp(0.5rem, 0.5vw, 1rem);
  }
}
</style>
