<template>
  <nav class="navbar">
    <div class="nav-brand">
      <font-awesome-icon icon="code" class="brand-icon" />
      <span>Les Meilleurs Clics</span>
    </div>
    <div class="nav-links">
      <router-link to="/" class="nav-link">
        <font-awesome-icon icon="home" />
        <span>Accueil</span>
      </router-link>
      <router-link to="/file-tree" class="nav-link">
        <font-awesome-icon icon="folder-tree" />
        <span>Explorateur</span>
      </router-link>
      <router-link to="/about" class="nav-link">
        <font-awesome-icon icon="info-circle" />
        <span>À propos</span>
      </router-link>
      <ThemeToggle />
    </div>
  </nav>
  <router-view/>
</template>

<script>
import ThemeToggle from './components/ThemeToggle.vue';

export default {
  name: 'App',
  components: {
    ThemeToggle
  }
}
</script>

<style>
#app {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a0a0a0;
  text-decoration: none;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
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
  --file-hover: #4c4c4d;
}

/* Personnalisation de la scrollbar pour Webkit (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--text-secondary);
  border-radius: 4px;
  transition: background 0.2s ease;
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

/* Style pour une scrollbar plus fine et moderne */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--text-secondary) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--text-secondary);
  border-radius: 3px;
  border: 2px solid transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: var(--accent-color);
}
</style>
