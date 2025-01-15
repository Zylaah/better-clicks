import { defineStore } from 'pinia'

export const usePerformanceStore = defineStore('performance', {
  state: () => ({
    isLowPerfDevice: false,
    prefersReducedMotion: false,
    fps: 60,
    lastFrameTime: 0,
    frameCount: 0
  }),

  getters: {
    shouldReduceAnimations: (state) => state.isLowPerfDevice || state.prefersReducedMotion,
    
    currentFPS: (state) => state.fps
  },

  actions: {
    detectDeviceCapabilities() {
      // Détection des préférences de réduction de mouvement
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Détection des performances de l'appareil
      this.measurePerformance()
    },

    measurePerformance() {
      let startTime = performance.now()
      let frames = 0

      const measure = () => {
        frames++
        const currentTime = performance.now()
        const elapsed = currentTime - startTime

        if (elapsed >= 1000) { // Mesure sur 1 seconde
          this.fps = Math.round((frames * 1000) / elapsed)
          this.isLowPerfDevice = this.fps < 30 // Considère comme faible performance si < 30 FPS
          
          // Réinitialisation pour la prochaine mesure
          startTime = currentTime
          frames = 0
        }

        // Continue la mesure seulement pendant les 5 premières secondes
        if (elapsed < 5000) {
          requestAnimationFrame(measure)
        }
      }

      requestAnimationFrame(measure)
    },

    // Pour les tests de performance spécifiques
    startFrameTracking() {
      this.lastFrameTime = performance.now()
      this.frameCount = 0
    },

    trackFrame() {
      const currentTime = performance.now()
      const elapsed = currentTime - this.lastFrameTime

      this.frameCount++
      
      if (elapsed >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / elapsed)
        this.lastFrameTime = currentTime
        this.frameCount = 0
      }
    }
  }
}) 