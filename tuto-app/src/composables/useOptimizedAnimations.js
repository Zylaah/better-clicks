import { ref, onMounted, onUnmounted, computed } from 'vue'
import { usePerformanceStore } from '@/stores/performance'

export function useOptimizedAnimations(options = {}) {
  const {
    minFPS = 30,
    measurementDuration = 1000,
    adaptiveThreshold = 0.8
  } = options

  const performanceStore = usePerformanceStore()
  const animationsEnabled = ref(true)
  const lastFrameTime = ref(0)
  const frameCount = ref(0)
  const currentFPS = ref(60)
  const adaptiveQuality = ref(1)

  // Classes CSS optimisées en fonction des performances
  const animationClasses = computed(() => ({
    'use-transitions': animationsEnabled.value,
    'reduce-motion': performanceStore.prefersReducedMotion,
    'disable-animations': performanceStore.isLowPerfDevice,
    'high-performance': adaptiveQuality.value > 0.8,
    'medium-performance': adaptiveQuality.value > 0.5 && adaptiveQuality.value <= 0.8,
    'low-performance': adaptiveQuality.value <= 0.5
  }))

  // Mesure des FPS en temps réel
  const measurePerformance = () => {
    const now = performance.now()
    frameCount.value++

    if (now - lastFrameTime.value >= measurementDuration) {
      currentFPS.value = (frameCount.value * 1000) / (now - lastFrameTime.value)
      frameCount.value = 0
      lastFrameTime.value = now

      // Ajuster la qualité des animations en fonction des FPS
      adaptiveQuality.value = Math.min(
        1,
        Math.max(0, currentFPS.value / 60) * adaptiveThreshold
      )

      // Mettre à jour le mode de performance
      updatePerformanceMode()
    }

    if (animationsEnabled.value) {
      requestAnimationFrame(measurePerformance)
    }
  }

  // Mise à jour du mode de performance
  const updatePerformanceMode = () => {
    const isLowPerformance = currentFPS.value < minFPS
    performanceStore.isLowPerfDevice = isLowPerformance
    
    if (isLowPerformance) {
      performanceStore.shouldReduceAnimations = true
    }
    
    animationsEnabled.value = !performanceStore.shouldReduceAnimations
  }

  // Gestionnaire de changement des préférences de mouvement
  const handleReducedMotionChange = (e) => {
    performanceStore.prefersReducedMotion = e.matches
    updatePerformanceMode()
  }

  // Optimisation des animations avec requestAnimationFrame
  const animateWithRAF = (element, animationFn, duration = 300) => {
    if (!animationsEnabled.value) {
      return Promise.resolve()
    }

    return new Promise((resolve) => {
      const startTime = performance.now()
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(1, elapsed / duration)
        
        // Appliquer l'animation avec la qualité adaptative
        animationFn(progress * adaptiveQuality.value)
        
        if (progress < 1 && animationsEnabled.value) {
          requestAnimationFrame(animate)
        } else {
          resolve()
        }
      }
      
      requestAnimationFrame(animate)
    })
  }

  // Fonction utilitaire pour animer de manière optimisée
  const animateIfPossible = (element, animationClass, duration = 300) => {
    if (!animationsEnabled.value) {
      return Promise.resolve()
    }

    return new Promise((resolve) => {
      // Appliquer la classe avec la qualité adaptative
      element.style.setProperty('--animation-scale', adaptiveQuality.value)
      element.classList.add(animationClass)
      
      const cleanup = () => {
        element.classList.remove(animationClass)
        element.removeEventListener('animationend', handleAnimationEnd)
        resolve()
      }

      const handleAnimationEnd = () => cleanup()
      element.addEventListener('animationend', handleAnimationEnd)
      
      // Fallback avec durée adaptative
      setTimeout(cleanup, duration * (1 / adaptiveQuality.value) + 100)
    })
  }

  onMounted(() => {
    // Détection initiale des capacités
    performanceStore.detectDeviceCapabilities()
    lastFrameTime.value = performance.now()
    
    // Démarrer la mesure des performances
    requestAnimationFrame(measurePerformance)

    // Écoute des changements de préférences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', handleReducedMotionChange)
  })

  onUnmounted(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.removeEventListener('change', handleReducedMotionChange)
    animationsEnabled.value = false
  })

  return {
    animationClasses,
    animationsEnabled,
    animateIfPossible,
    animateWithRAF,
    currentFPS,
    adaptiveQuality
  }
} 