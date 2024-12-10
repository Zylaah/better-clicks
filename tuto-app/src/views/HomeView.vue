<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-content">
        <h1>Découvrez l'Informatique Simplement</h1>
        <p class="subtitle">Apprenez à utiliser votre ordinateur pas à pas, sans stress et à votre rythme</p>
        <div class="cta-buttons">
          <router-link to="/tutorials" class="cta-button primary">
            <font-awesome-icon icon="graduation-cap" />
            Débuter l'apprentissage
          </router-link>
          <router-link to="/basics" class="cta-button secondary">
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
            <font-awesome-icon icon="computer" />
          </div>
          <h3>Les Bases de Windows</h3>
          <p>Découvrez comment utiliser votre ordinateur : bureau, fichiers, programmes et paramètres essentiels</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <font-awesome-icon icon="globe" />
          </div>
          <h3>Internet et Navigation</h3>
          <p>Naviguez sur Internet en toute sécurité, utilisez votre messagerie et découvrez les sites utiles</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <font-awesome-icon icon="shield-halved" />
          </div>
          <h3>Sécurité Numérique</h3>
          <p>Protégez-vous des virus, gérez vos mots de passe et sécurisez vos données personnelles</p>
        </div>
      </div>
    </div>

    <div class="latest-tutorials">
      <h2>Tutoriels Recommandés</h2>
      <div class="tutorials-grid">
        <div class="tutorial-card">
          <div class="tutorial-badge">Débutant</div>
          <div class="tutorial-content">
            <h3>Premiers Pas avec Windows</h3>
            <p>Apprenez à allumer votre PC, utiliser la souris et le clavier efficacement</p>
            <div class="tutorial-meta">
              <span><font-awesome-icon icon="clock" /> 30 min</span>
              <span><font-awesome-icon icon="star" /> Pour débutants</span>
            </div>
          </div>
        </div>

        <div class="tutorial-card">
          <div class="tutorial-content">
            <h3>Gérer ses Fichiers</h3>
            <p>Organisez vos documents, photos et dossiers comme un pro</p>
            <div class="tutorial-meta">
              <span><font-awesome-icon icon="clock" /> 45 min</span>
              <span><font-awesome-icon icon="keyboard" /> Pratique</span>
            </div>
          </div>
        </div>

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
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-color);
}

.hero-section {
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px;
  background: radial-gradient(circle at center, var(--hover-color) 0%, transparent 70%);
}

.hero-content {
  max-width: 800px;
}

h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, var(--accent-color), var(--link-hover));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.subtitle {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.cta-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
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

.features-section {
  padding: 4rem 2rem;
  background: var(--bg-secondary);
}

.features-section h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
  color: var(--accent-color);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s ease;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px var(--shadow-color);
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  color: var(--accent-color);
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .features-grid {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
}

.latest-tutorials {
  padding: 4rem 2rem;
  background: var(--bg-primary);
}

.tutorials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.tutorial-card {
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px var(--shadow-color);
  transition: transform 0.3s ease;
}

.tutorial-card:hover {
  transform: translateY(-5px);
}

.tutorial-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--accent-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.tutorial-content {
  padding: 2rem;
}

.tutorial-content h3 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.tutorial-content p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.tutorial-meta {
  display: flex;
  gap: 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.tutorial-meta span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .tutorials-grid {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
}
</style>
