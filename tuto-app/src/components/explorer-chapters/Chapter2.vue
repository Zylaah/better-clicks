<template>
  <div class="chapter">
    <!-- Section Introduction -->
    <section class="chapter-section">
      <h2>🗂️ Introduction aux Dossiers</h2>
      <div class="concept-card">
        <p>Les dossiers sont comme les étagères de votre bibliothèque numérique. Ils vous permettent d'organiser et de classer vos fichiers de manière logique et efficace.</p>
      </div>
    </section>

    <!-- Section Définition -->
    <section class="chapter-section">
      <h2>📁 Qu'est-ce qu'un Dossier ?</h2>
      <div class="info-box">
        <p>Un dossier est un conteneur virtuel qui peut stocker des fichiers et d'autres dossiers. C'est l'outil principal pour organiser vos données numériques de manière hiérarchique.</p>
      </div>

      <div class="example-grid">
        <div class="example-card">
          <font-awesome-icon icon="folder" class="icon blue" />
          <h3>Documents</h3>
          <p>Factures, lettres, contrats</p>
        </div>
        <div class="example-card">
          <font-awesome-icon icon="images" class="icon green" />
          <h3>Photos</h3>
          <p>Vacances, famille, événements</p>
        </div>
        <div class="example-card">
          <font-awesome-icon icon="folder-open" class="icon purple" />
          <h3>Téléchargements</h3>
          <p>Fichiers récupérés d'Internet</p>
        </div>
        <div class="example-card">
          <font-awesome-icon icon="folder-tree" class="icon red" />
          <h3>Sous-dossiers</h3>
          <p>Organisation par catégories</p>
        </div>
      </div>
    </section>

    <!-- Section Structure des dossiers -->
    <section class="chapter-section">
      <h2>🌳 Structure des Dossiers</h2>
      <div class="anatomy-card">
        <h3>Les 3 concepts clés :</h3>
        <div class="anatomy-item">
          <h4>1. Hiérarchie</h4>
          <p>Organisation en arborescence (dossiers principaux et sous-dossiers)</p>
          <div class="tip-box">
            <font-awesome-icon icon="lightbulb" class="icon yellow" />
            <p>Conseil : Créez une structure logique qui reflète vos besoins</p>
          </div>
        </div>
        <div class="anatomy-item">
          <h4>2. Navigation</h4>
          <p>Déplacement entre les dossiers pour accéder à vos fichiers</p>
          <div class="common-extensions">
            <span class="extension">Documents</span>
            <span class="extension">Images</span>
            <span class="extension">Musique</span>
            <span class="extension">Vidéos</span>
          </div>
        </div>
        <div class="anatomy-item">
          <h4>3. Organisation</h4>
          <p>Classement logique pour retrouver facilement vos fichiers</p>
        </div>
      </div>
    </section>

    <!-- Section Bonnes Pratiques -->
    <section class="chapter-section">
      <h2>✨ Bonnes Pratiques</h2>
      <div class="practices-grid">
        <div class="practice-card">
          <font-awesome-icon icon="check-circle" class="icon green" />
          <h4>Nommage Clair</h4>
          <p>Utilisez des noms descriptifs pour vos dossiers</p>
          <div class="example-box">
            <p>✅ Photos_Vacances_2024</p>
            <p>❌ Nouveau dossier</p>
          </div>
        </div>
        <div class="practice-card">
          <font-awesome-icon icon="layer-group" class="icon blue" />
          <h4>Structure Simple</h4>
          <p>Évitez de créer trop de sous-dossiers</p>
          <div class="example-box-grid">
            <div class="example-box">
              <p>✅ Photos → Vacances → Été</p>
            </div>
          </div>
        </div>
        <div class="practice-card">
          <font-awesome-icon icon="broom" class="icon purple" />
          <h4>Rangement Régulier</h4>
          <p>Triez et nettoyez vos dossiers régulièrement</p>
        </div>
        <div class="practice-card">
          <font-awesome-icon icon="handshake-angle" class="icon orange" />
          <h4>Besoin d'aide ?</h4>
          <p>N'hésitez pas à demander conseil à un proche ou un conseiller numérique.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ExplorerChapterTwo',
  props: {
    chapterData: {
      type: Object,
      required: true
    }
  }
}
</script>

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