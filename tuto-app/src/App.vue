<template>
  <div class="app-container">
    <TitleBar />
    <nav class="navbar">
      <div class="nav-left">
        <router-link to="/" class="nav-brand">
          <img src="@/assets/icon.png" alt="Logo Numérix" class="brand-icon" />
        </router-link>
        <router-link 
          v-if="showBackButton" 
          :to="backButtonRoute"
          class="nav-link back-nav-button"
        >
          <font-awesome-icon icon="arrow-left" />
          <span>Retour</span>
        </router-link>
      </div>
      <div class="nav-links">
        <router-link to="/" class="nav-link">
          <font-awesome-icon icon="home" />
          <span>Accueil</span>
        </router-link>
        <div class="menu-container" :class="{ 'active': isGuideActive }">
          <div class="nav-link">
            <font-awesome-icon icon="book" />
            <span>Les guides</span>
          </div>
          <div class="menu-content-guide">
            <ul>
              <li>
                <router-link to="/guide-explorer" class="nav-link-menu">
                  <font-awesome-icon icon="folder-tree" />
                  <span>Explorateur</span>
                </router-link>
              </li>
            </ul> 
          </div>
        </div>
        <div class="menu-container" :class="{ 'active': isExerciseActive }">
          <div class="nav-link">
            <font-awesome-icon icon="code" />
            <span>Les exercices</span>
          </div>
          <div class="menu-content-exercise">
            <ul><li>
                <router-link to="/keyboard" class="nav-link-menu">
                  <font-awesome-icon icon="keyboard" />
                  <span>Le clavier</span>
                </router-link>
              </li>
              <hr>
              <li>
                <router-link to="/file-tree" class="nav-link-menu">
                  <font-awesome-icon icon="folder-tree" />
                  <span>Explorateur</span>
                </router-link>
              </li>
            </ul> 
          </div>
        </div>
        
        <router-link to="/about" class="nav-link">
          <font-awesome-icon icon="info-circle" />
          <span>À propos</span>
        </router-link>
        <ThemeToggle />
      </div>
    </nav>
    <div class="router-view-container">
      <router-view/>
    </div>
    <div class="mobile-message">
      <font-awesome-icon icon="desktop" class="desktop-icon" />
      <h2>Mettez l'application <br> en plein écran !</h2>
      <p>Ce module n'est disponible que sur ordinateur pour une meilleure expérience d'apprentissage.</p>
    </div>
  </div>
</template>

<script>
import ThemeToggle from './components/ThemeToggle.vue';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TitleBar from './views/TitleBar.vue';
import { useIndexedDB } from '@/composables/useIndexedDB'
import { useExerciseCache } from '@/composables/useExerciseCache'

export default {
  name: 'App',
  components: {
    ThemeToggle,
    TitleBar
  },
  setup() {
    const route = useRoute();
    const { isReady, hasError } = useIndexedDB()
    const { preloadInitialExercises } = useExerciseCache()

    const isGuideActive = computed(() => {
      return route.path === '/guide-explorer'; // Ajustez selon vos routes
    });

    const isExerciseActive = computed(() => {
      return route.path === '/file-tree' || route.path === '/keyboard' || route.path.startsWith('/exercise/'); // Ajustez selon vos routes
    });

    const showBackButton = computed(() => {
      return route.name === 'keyboard-lettre' || 
             route.name === 'keyboard-phrase' ||
             route.name === 'keyboard-symboles'||
             route.name === 'keyboard-mots' ||
             route.name === 'exercise';
    });

    const backButtonRoute = computed(() => {
      if (route.name === 'exercise') {
        return '/file-tree';
      }
      return '/keyboard';
    });

    onMounted(async () => {
      console.log('App mounted, initializing IndexedDB...')
      try {
        // Attendre que IndexedDB soit prêt
        await new Promise((resolve) => {
          const checkReady = () => {
            console.log('Checking IndexedDB status:', { isReady: isReady.value, hasError: hasError.value })
            if (isReady.value) {
              console.log('IndexedDB is ready')
              resolve()
            } else if (hasError.value) {
              console.warn('IndexedDB initialization failed, continuing in fallback mode')
              resolve()
            } else {
              setTimeout(checkReady, 100)
            }
          }
          checkReady()
        })

        // Précharger les exercices
        console.log('Preloading exercises...')
        await preloadInitialExercises(['lettres', 'mots', 'phrases', 'symboles'])
        console.log('Exercises preloaded successfully')
      } catch (error) {
        console.error('Error during app initialization:', error)
      }
    })

    return {
      isGuideActive,
      isExerciseActive,
      showBackButton,
      backButtonRoute
    };
  }
}
</script>

<style>
#app {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container{
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.router-view-container{
  flex: 1;
  position: relative;
  z-index: 1;
  padding: 0;
  overflow-y: auto;
}

body, html{
  margin: 0 ;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-tertiary);
}

.navbar {
  background: var(--navbar-bg);
  padding: 0.3rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 30px;
  left: 0;
  right: 0;
  z-index: 1000;
  height: var(--navbar-height);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
}

.brand-icon {
  color: #42b883;
  width: 40px;
  height: 40px;
  transition: all 0.8s ease;
}

.nav-brand:hover .brand-icon {
  transform: scale(1.2) rotate(360deg);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-link-menu {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-link-menu:hover {
  color: #42b883;
  background: rgba(66, 184, 131, 0.1);
}

.nav-link-menu.router-link-active {
  color: #42b883;
  background: rgba(66, 184, 131, 0.1);
}

.nav-link:hover {
  color: #42b883;
  background: rgba(66, 184, 131, 0.1);
}

.nav-link.router-link-active {
  color: #42b883;
  background: rgba(66, 184, 131, 0.1);
}

.mobile-message {
  display: none;
  text-align: center;
  padding: clamp(0.5rem, 1vw, 1rem) clamp(1rem, 2vw, 2rem);
  margin: clamp(0.5rem, 1vw, 1rem);
  background: var(--bg-secondary);
  border-radius: 10px;
  box-shadow: 0 2px 4px var(--shadow-color);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 400px;
}

.mobile-message svg {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
  color: var(--accent-color);
}

.mobile-message h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
  color: var(--text-color);
}

.mobile-message p {
  font-size: 1rem;
  color: var(--text-secondary);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-nav-button {
  background-color: var(--accent-color);
  color: var(--text-color);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.back-nav-button:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

/* Ajuster le style responsive si nécessaire */
@media (max-width: 768px) {
  .nav-left {
    width: auto;
  }
  
  .back-nav-button span {
    display: none;
  }
  
  .back-nav-button {
    padding: 0.5rem;
  }
}

/* Animation de transition entre les pages */
.router-view-transition {
  transition: all 0.3s ease;
}

.router-view-enter-from,
.router-view-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .navbar {
    padding: 0.8rem 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links {
    width: 100%;
    justify-content: space-around;
  }

  .nav-link span {
    display: none;
  }

  .nav-link {
    padding: 0.5rem;
  }
}

@media (max-width: 940px) {
  .mobile-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

@media (max-width: 1180px) {
  .nav-links {
    gap: 0.5rem;
  }

  .nav-link span {
    font-size: 0.8rem;
  }

  .navbar {
    height: calc(var(--navbar-height) * 0.8);
  }
}

.menu-container {
  position: relative;
  display: flex;
}

.menu-container:hover {
  cursor: pointer;
}

.menu-container.active .nav-link {
  color: #42b883;
  background: rgba(66, 184, 131, 0.1);
}

.menu-content-guide,
.menu-content-exercise {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--navbar-bg);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.menu-content-guide {
  width: 150px;
}

.menu-content-exercise {
  width: auto;
}

.menu-content-guide ul,
.menu-content-exercise ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-content-guide li,
.menu-content-exercise li {
  padding: 0.5rem 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.menu-content-guide li.router-link,
.menu-content-exercise li.router-link {
  color: var(--text-secondary);
  text-decoration: none;
}

.menu-content-guide li.router-link:hover,
.menu-content-exercise li.router-link:hover {
  color: var(--text-color);
  background: var(--hover-color);
}

.menu-content-guide hr,
.menu-content-exercise hr {
  margin: 0;
  border: none;
  width: 80%;
  margin-left: 10%;
  border-top: 1px solid var(--hover-color);
}

.menu-container:hover .menu-content-guide,
.menu-container:hover .menu-content-exercise {
  display: block;
}

:root {
  /* Light theme */
  --bg-primary: #ffffff;
  --bg-secondary: #e6e6e6;
  --bg-tertiary: #ffffff;
  --text-color: #2c3e50;
  --text-secondary: #6c757d;
  --accent-color: #42b883;
  --border-color: #7a7a7a;
  --hover-color: rgba(66, 184, 131, 0.1);
  --card-bg: #ffffff;
  --navbar-bg: #eff3f7;
  --shadow-color: rgba(0, 0, 0, 0.3);
  --input-bg: #f8fafc;
  --input-border: #e2e8f0;
  --success-color: #42b883;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  --code-bg: #f8fafc;
  --link-color: #42b883;
  --link-hover: #3aa876;
  --file-hover: #d8d8d8;
  --scrollbar-color: #d8d8d8;
  --selected-node-bg: #dadada;
  --switch-buttob-bg: #d8d8d8;
  --menu-bg: #1e2a24;
  --titlebar-bg: #f8fafc;
  --sidebar-bg: #eff3f7;
  --navbar-height: 60px;
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2c2c2c;
  --bg-tertiary: #131313;
  --text-color: #ffffff;
  --text-secondary: #a0a0a0;
  --accent-color: #42b883;
  --border-color: #3c3c3c;
  --hover-color: rgba(66, 184, 131, 0.15);
  --card-bg: #2c2c2c;
  --navbar-bg: #1a1a1a;
  --shadow-color: rgba(0, 0, 0, 0.3);
  --input-bg: #3c3c3c;
  --input-border: #4a4a4a;
  --success-color: #42b883;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  --code-bg: #3c3c3c;
  --link-color: #42b883;
  --link-hover: #3aa876;
  --file-hover: #1a1a1a;
  --scrollbar-color: #131313;
  --selected-node-bg: #1a1a1a;
  --switch-buttob-bg: #1a1a1a;
  --menu-bg: #1e2a24;
  --titlebar-bg: #131313;
  --sidebar-bg: #1a1a1a;
}

/* Personnalisation de la scrollbar pour Webkit (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  z-index: 1;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 4px;
  z-index: 1;
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-color);
  border-radius: 4px;
  z-index: 1;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent-color);
}

/* Pour Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--text-secondary) var(--bg-secondary);
}

/* Cacher la scrollbar mais garder la fonctionnalité (optionnel) */
.hide-scrollbar {
  -ms-overflow-style: none;  /* Pour Internet Explorer et Edge */
  scrollbar-width: none;  /* Pour Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Pour Chrome, Safari et Opera */
}

/* Styles de scrollbar */
.main-content::-webkit-scrollbar {
  width: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

.main-content::-webkit-scrollbar-thumb {
  background: var(--scrollbar-color);
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: var(--accent-color);
}

/* Assurez-vous que les éléments qui doivent être au-dessus ont un z-index plus élevé */
.titlebar {
  z-index: 1000;
}

.navbar {
  z-index: 999;
}

/* Pour les conteneurs avec scrollbar */
.tree-container, .selected-content {
  position: relative;
  z-index: 1;
}
</style>
