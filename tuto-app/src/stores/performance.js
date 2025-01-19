import { defineStore } from 'pinia'

export const usePerformanceStore = defineStore('performance', {
  state: () => ({
    fps: 60,
    isLowPerfDevice: false,
    prefersReducedMotion: false,
    measureCount: 0,
    lastMeasureTime: 0
  }),

  getters: {
    shouldReduceAnimations: (state) => state.isLowPerfDevice || state.prefersReducedMotion,
    
    currentFPS: (state) => state.fps
  },

  actions: {
    detectDeviceCapabilities() {
      // Vérifier les préférences de mouvement
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      
      // Démarrer la mesure des performances
      this.measurePerformance()
    },

    measurePerformance() {
      let frameCount = 0
      let lastTime = performance.now()
      
      const measure = () => {
        const now = performance.now()
        frameCount++
        
        if (now - lastTime >= 1000) {
          this.fps = Math.round(frameCount * 1000 / (now - lastTime))
          this.isLowPerfDevice = this.fps < 30
          frameCount = 0
          lastTime = now
          
          // Arrêter la mesure si les performances sont stables
          if (this.fps > 50 && this.measureCount++ > 5) {
            return
          }
        }
        
        requestAnimationFrame(measure)
      }
      
      requestAnimationFrame(measure)
    },

    // Pour les tests de performance spécifiques
    startFrameTracking() {
      this.lastMeasureTime = performance.now()
    },

    trackFrame() {
      const currentTime = performance.now()
      const elapsed = currentTime - this.lastMeasureTime

      if (elapsed >= 1000) {
        this.fps = Math.round((this.measureCount * 1000) / elapsed)
        this.isLowPerfDevice = this.fps < 30
        this.measureCount = 0
        this.lastMeasureTime = currentTime
      }
    }
  }
}) 