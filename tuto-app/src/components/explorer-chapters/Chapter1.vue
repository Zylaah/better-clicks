<template>
  <div class="chapter">
    <!-- Section Introduction -->
    <section class="chapter-section">
      <h2>🎯 Introduction aux Fichiers Numériques</h2>
      <div class="concept-card">
        <p>Le contenu de l'ordinateur est organisé en <b>fichiers</b>, eux mêmes présents dans des <b>dossiers</b>. On appelle cela l'arborescence, car chaque dossier peut lui-même contenir plusieurs dossiers, formant ainsi des "branches" de l'arborescence.</p>
      </div>
    </section>

    <!-- Section Définition -->
    <section class="chapter-section">
      <h2>📝 Qu'est-ce qu'un Fichier ?</h2>
      <div class="info-box">
        <p>Un fichier est un ensemble d'informations numériques stockées sur un ordinateur. C'est le conteneur de base pour toutes vos données numériques.</p>
      </div>

      <div class="example-grid">
        <div class="example-card">
          <font-awesome-icon icon="file" class="icon blue" />
          <h3>Documents</h3>
          <p>Lettres, rapports, notes</p>
        </div>
        <div class="example-card">
          <font-awesome-icon icon="image" class="icon green" />
          <h3>Images</h3>
          <p>Photos, dessins, logos</p>
        </div>
        <div class="example-card">
          <font-awesome-icon icon="music" class="icon purple" />
          <h3>Musique</h3>
          <p>Chansons, sons</p>
        </div>
        <div class="example-card">
          <font-awesome-icon icon="film" class="icon red" />
          <h3>Vidéos</h3>
          <p>Films, clips</p>
        </div>
      </div>
    </section>

    <!-- Section Anatomie d'un fichier -->
    <section class="chapter-section">
      <h2>🔍 Anatomie d'un Fichier</h2>
      <div class="anatomy-card">
        <h3>Les 3 éléments essentiels :</h3>
        <div class="anatomy-item">
          <h4>1. Le Nom</h4>
          <p>Identifie votre fichier (ex: "photo_vacances")</p>
          <div class="tip-box">
            <font-awesome-icon icon="lightbulb" class="icon yellow" />
            <p>Conseil : Utilisez des noms descriptifs et évitez les caractères spéciaux</p>
          </div>
        </div>
        <div class="anatomy-item">
          <h4>2. L'Extension</h4>
          <p>Indique le type de fichier (ex: ".jpg", ".doc", ".pdf")</p>
          <div class="common-extensions">
            <span class="extension">.txt</span>
            <span class="extension">.docx</span>
            <span class="extension">.pdf</span>
            <span class="extension">.jpg</span>
            <span class="extension">.mp3</span>
          </div>
        </div>
        <div class="anatomy-item">
          <h4>3. Le Contenu</h4>
          <p>Les données stockées dans le fichier</p>
        </div>
      </div>
    </section>

    <!-- Section Bonnes Pratiques -->
    <section class="chapter-section">
      <h2>✨ Bonnes Pratiques</h2>
      <div class="practices-grid">
        <div class="practice-card">
          <font-awesome-icon icon="check" class="icon green" />
          <h4>Nommage Clair</h4>
          <p>Utilisez des noms descriptifs et datés</p>
          <div class="example-box">
            <p>✅ rapport_mensuel_2024_01.docx</p>
            <p>❌ doc1.docx</p>
          </div>
        </div>
        <div class="practice-card">
          <font-awesome-icon icon="sitemap" class="icon blue" />
          <h4>Organisation</h4>
          <p>Rangez vos fichiers dans des dossiers thématiques</p>
          <div class="example-box-grid">
            <div class="example-box">
                <p>✅ Vacances</p>
            </div>
            <div class="example-box">
                <p>✅ Radios</p>
            </div>
            <div class="example-box">
                <p>✅ Documents</p>
            </div>
          </div>
        </div>
        <div class="practice-card">
          <font-awesome-icon icon="shield" class="icon purple" />
          <h4>Sauvegarde</h4>
          <p>Faites des copies de vos fichiers importants</p>
        </div>
        <div class="practice-card">
          <font-awesome-icon icon="handshake" class="icon orange" />
          <h4>Si c'est trop difficile</h4>
          <p>Faites vous aider par un membre de vote famille ou un conseiller numériques.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

p {
  color: var(--text-color);
}

h4 {
  color: var(--accent-color);
}

.chapter {
  padding: 1rem;
}

.chapter-section {
  margin-bottom: 3rem;
}

.chapter-section h2 {
  color: var(--accent-color);
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.concept-card {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 12px;
  font-size: 1.2rem;
  line-height: 1.6;
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.example-card {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease;
}

.example-card:hover {
  transform: translateY(-5px);
  outline: 1px solid var(--accent-color);
}

.icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.icon.blue { color: #3498db; }
.icon.green { color: #2ecc71; }
.icon.purple { color: #9b59b6; }
.icon.red { color: #e74c3c; }
.icon.yellow { color: #f1c40f; }
.icon.orange { color: #f39c12; }

.anatomy-card {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 12px;
  margin-top: 1.5rem;
}

.anatomy-item {
  margin: 1.5rem 0;
  padding: 1rem;
  border-left: 4px solid var(--accent-color);
  background: var(--bg-primary);
  border-radius: 0 8px 8px 0;
}

.tip-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(241, 196, 15, 0.1);
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
}

.common-extensions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.extension {
  background: var(--bg-primary);
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-family: monospace;
  color: var(--accent-color);
  font-weight: bold;
}

.practices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.practice-card {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.example-box {
  background: var(--bg-tertiary);
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  font-family: monospace;
}

.example-box-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
}

.info-box {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  font-size: 1.1rem;
  line-height: 1.6;
}
</style>

<script>
import { onBeforeMount, getCurrentInstance } from 'vue'

export default {
  name: 'ChapterOne',
  
  setup() {
    const { proxy: app } = getCurrentInstance()
    
    onBeforeMount(async () => {
      await Promise.all([
        app.$loadIcon('file'),
        app.$loadIcon('image'),
        app.$loadIcon('music'),
        app.$loadIcon('film'),
        app.$loadIcon('lightbulb'),
        app.$loadIcon('check'),
        app.$loadIcon('sitemap'),
        app.$loadIcon('shield'),
        app.$loadIcon('handshake')
      ])
    })
  }
}
</script>
