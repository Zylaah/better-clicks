<template>
  <div class="app-container">
    <TitleBar />
    <nav class="navbar">
      <div class="nav-brand">
        <img src="@/assets/icon.png" alt="Logo Numérix" class="brand-icon" />
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
                <a href="" class="nav-link-menu">
                  <font-awesome-icon icon="keyboard" />
                  <span>Le clavier</span>
                </a>
              </li>
            </ul> 
          </div>
        </div>
        <div class="menu-container" :class="{ 'active': isExerciseActive }">
          <div class="nav-link">
            <font-awesome-icon icon="book" />
            <span>Les exercices</span>
          </div>
          <div class="menu-content-exercise">
            <ul>
              <li>
                <router-link to="/file-tree" class="nav-link-menu">
                  <font-awesome-icon icon="folder-tree" />
                  <span>Explorateur</span>
                </router-link>
              </li>
              <hr>
              <li>
                <a href="/le-clavier" class="nav-link-menu">
                  <font-awesome-icon icon="keyboard" />
                  <span>Le clavier</span>
                </a>
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
  </div>
</template>

<script>
import ThemeToggle from './components/ThemeToggle.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import TitleBar from './views/TitleBar.vue';

export default {
  name: 'App',
  components: {
    ThemeToggle,
    TitleBar
  },
  setup() {
    const route = useRoute();

    const isGuideActive = computed(() => {
      return route.path === '/le-clavier'; // Ajustez selon vos routes
    });

    const isExerciseActive = computed(() => {
      return route.path === '/file-tree' || route.path === '/le-clavier'; // Ajustez selon vos routes
    });

    return {
      isGuideActive,
      isExerciseActive
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
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

body, html{
  margin: 0 ;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-tertiary);
}

.navbar {
  background: #1a1a1a;
  padding: 0.8rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 30px;
  left: 0;
  right: 0;
  z-index: 1000;
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
  color: white;
  background: rgba(66, 184, 131, 0.1);
}

.nav-link-menu.router-link-active {
  color: #42b883;
  background: rgba(66, 184, 131, 0.1);
}

.nav-link:hover {
  color: white;
  background: rgba(66, 184, 131, 0.1);
}

.nav-link.router-link-active {
  color: #42b883;
  background: rgba(66, 184, 131, 0.1);
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
  border: 1px solid var(--hover-color);
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
  border-top: 1px solid var(--hover-color);
}

.menu-container:hover .menu-content-guide,
.menu-container:hover .menu-content-exercise {
  display: block;
}

:root {
  /* Light theme */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #ffffff;
  --text-color: #2c3e50;
  --text-secondary: #6c757d;
  --accent-color: #42b883;
  --border-color: #e2e8f0;
  --hover-color: rgba(66, 184, 131, 0.1);
  --card-bg: #ffffff;
  --navbar-bg: #1a1a1a;
  --shadow-color: rgba(0, 0, 0, 0.1);
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
