<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-content">
        <h1>
          <span class="line-1 anim-typewriter">Découvrez l'Informatique !</span>
        </h1>
        <p class="subtitle">Apprenez à utiliser votre ordinateur pas à pas, sans stress et à votre rythme</p>
        <div class="cta-buttons">
          <router-link to="/file-tree" class="cta-button primary">
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
  height: 100vh;
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

.typewriter {
  overflow: hidden;
  border-right: .15em solid var(--accent-color);
  white-space: nowrap;
  margin: 0 auto;
  letter-spacing: .15em;
  animation: typing 4s steps(40, end), blink-caret .75s step-end infinite;
}

.text {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  animation: typing 4s steps(40, end) forwards;
}

@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: var(--accent-color) }
}

@media (max-width: 768px) {
  .typewriter {
    font-size: 1.8rem;
    letter-spacing: .1em;
  }
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
  height: 40vh;
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
  .title-wrapper {
    font-size: 2rem;
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

h1 {
  color: var(--accent-color);
  position: relative;
  display: inline-block;
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  text-align: center;
  width: 100%;
}

.line-1 {
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
  text-align: center;
  border-right: 2px solid var(--accent-color);
}

.anim-typewriter {
  animation: typewriter 2s steps(20) 1s 1 normal both,
             blinkTextCursor 500ms steps(20) infinite normal;
}

.anim-typewriter-2 {
  opacity: 0;
  animation: typewriter 1.5s steps(10) 3s 1 normal both,
             blinkTextCursor 500ms steps(10) infinite normal,
             fadeIn 1ms 3s forwards;
}

@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blinkTextCursor {
  from { border-right-color: var(--accent-color); }
  to { border-right-color: transparent; }
}

@keyframes fadeIn {
  to { opacity: 1; }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }
}
</style>
