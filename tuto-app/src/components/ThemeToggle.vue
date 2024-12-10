<template>
    <button @click="toggleTheme" class="theme-toggle" :title="isDark ? 'Mode clair' : 'Mode sombre'">
      <font-awesome-icon :icon="isDark ? 'sun' : 'moon'" />
    </button>
  </template>
  
  <script>
  export default {
    name: 'ThemeToggle',
    data() {
      return {
        isDark: true
      }
    },
    methods: {
      toggleTheme() {
        this.isDark = !this.isDark
        document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light')
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
      }
    },
    mounted() {
      const savedTheme = localStorage.getItem('theme') || 'dark'
      this.isDark = savedTheme === 'dark'
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
  }
  </script>
  
  <style scoped>
  .theme-toggle {
    background: none;
    border: none;
    color: var(--text-color);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;
  }
  
  .theme-toggle:hover {
    background: var(--hover-color);
  }
  </style>