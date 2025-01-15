import { ref, onMounted, onUnmounted } from 'vue'
import { usePerformanceStore } from '@/stores/performance'

export function useOptimizedAnimations() {
  const performanceStore = usePerformanceStore()
  const animationsEnabled = ref(true)

  // Classes CSS optimisées en fonction des performances
  const animationClasses = ref({
    'use-transitions': true,
    'reduce-motion': false,
    'disable-animations': false
  })

  // Mise à jour des classes en fonction des performances
  const updateAnimationClasses = () => {
    animationClasses.value = {
      'use-transitions': !performanceStore.shouldReduceAnimations,
      'reduce-motion': performanceStore.prefersReducedMotion,
      'disable-animations': performanceStore.isLowPerfDevice
    }
    animationsEnabled.value = !performanceStore.shouldReduceAnimations
  }

  // Gestionnaire de changement des préférences de mouvement
  const handleReducedMotionChange = (e) => {
    performanceStore.prefersReducedMotion = e.matches
    updateAnimationClasses()
  }

  onMounted(() => {
    // Détection initiale des capacités
    performanceStore.detectDeviceCapabilities()
    updateAnimationClasses()

    // Écoute des changements de préférences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', handleReducedMotionChange)
  })

  onUnmounted(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.removeEventListener('change', handleReducedMotionChange)
  })

  // Fonction utilitaire pour animer de manière optimisée
  const animateIfPossible = (element, animationClass, duration = 300) => {
    if (!animationsEnabled.value) {
      return Promise.resolve()
    }

    return new Promise((resolve) => {
      element.classList.add(animationClass)
      
      const cleanup = () => {
        element.classList.remove(animationClass)
        element.removeEventListener('animationend', handleAnimationEnd)
        resolve()
      }

      const handleAnimationEnd = () => cleanup()

      element.addEventListener('animationend', handleAnimationEnd)
      
      // Fallback si l'animation ne se termine pas
      setTimeout(cleanup, duration + 100)
    })
  }

  return {
    animationClasses,
    animationsEnabled,
    animateIfPossible
  }
} 