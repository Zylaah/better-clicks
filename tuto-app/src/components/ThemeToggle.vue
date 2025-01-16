<template>
    <button @click="toggleTheme" class="theme-toggle" :title="isDark ? 'Mode clair' : 'Mode sombre'">
      <font-awesome-icon :icon="isDark ? 'sun' : 'moon'" />
    </button>
  </template>
  
  <script>
  import { onBeforeMount, getCurrentInstance } from 'vue'

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
    },
    setup() {
      const { proxy: app } = getCurrentInstance()
      
      onBeforeMount(async () => {
        await Promise.all([
          app.$loadIcon('sun'),
          app.$loadIcon('moon')
        ])
      })
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
    width: 40px;
  }

  .theme-toggle:hover {
    background: var(--hover-color);
  }

  .fa-sun {
    color: var(--accent-color);
  }

  .svg-inline--fa {
    margin-top: 3px;
  }

  .fa-moon {
    margin-top: 3px;
    color: #226144;
  }
  </style>