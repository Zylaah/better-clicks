<template>
    <div class="titlebar">
      <div class="title"><i>v0.2.0</i></div>
      <div class="titlebar-controls">
        <button class="titlebar-button minimize" @click="minimize">
          <span><font-awesome-icon icon="window-minimize" /></span>
        </button>
        <button class="titlebar-button maximize" @click="maximize">
          <span><font-awesome-icon icon="window-maximize" /></span>
        </button>
        <button class="titlebar-button close" @click="close">
          <span><font-awesome-icon icon="window-close" /></span>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { onBeforeMount, getCurrentInstance } from 'vue'
  
  export default {
    name: 'TitleBar',
    methods: {
      minimize() {
        if (window.electronAPI) {
          window.electronAPI.minimizeWindow()
        }
      },
      maximize() {
        window.electronAPI.maximizeWindow()
      },
      close() {
        window.electronAPI.closeWindow()
      }
    },
    
    setup() {
      const { proxy: app } = getCurrentInstance()
      
      onBeforeMount(async () => {
        await Promise.all([
          app.$loadIcon('windowMinimize'),
          app.$loadIcon('windowMaximize'),
          app.$loadIcon('windowClose')
        ])
      })
    }
  }
  </script>
  
  <style>
  .titlebar {
    -webkit-app-region: drag; /* Permet de déplacer la fenêtre */
    height: 30px;
    background: var(--titlebar-bg);
    user-select: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 0;
    padding-left: 20px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
  }
  
  .title {
    color: var(--text-color);
    font-size: 12px;
  }
  
  .titlebar-controls {
    -webkit-app-region: no-drag; /* Permet de cliquer sur les boutons */
    display: flex;
    gap: 8px;
  }
  
  .titlebar-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    background: transparent;
    border: none;
    color: var(--accent-color);
    cursor: pointer;
    font-size: 16px;
  }
  
  .titlebar-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .titlebar-button.close:hover {
    background: #e81123;
  }
  </style>