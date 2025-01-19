const CRITICAL_COMPONENTS = ['AzuretyKeyboard']
const SECONDARY_COMPONENTS = ['RestartModal', 'ProgressBar']

// Fonction pour précharger les composants critiques
export const preloadComponents = async () => {
  try {
    // Charger d'abord les composants critiques
    await Promise.all(
      CRITICAL_COMPONENTS.map(comp => 
        import(`@/components/keyboard/${comp}.vue`)
      )
    )
    
    // Précharger les composants secondaires en background
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        SECONDARY_COMPONENTS.forEach(comp => {
          import(`@/components/${comp}.vue`)
        })
      })
    } else {
      // Fallback pour les navigateurs qui ne supportent pas requestIdleCallback
      setTimeout(() => {
        SECONDARY_COMPONENTS.forEach(comp => {
          import(`@/components/${comp}.vue`)
        })
      }, 1000)
    }
  } catch (error) {
    console.error('Erreur de préchargement:', error)
  }
}

// Fonction pour précharger les assets critiques (images, styles, etc.)
export const preloadAssets = async () => {
  try {
    // Préchargement des styles
    await import('@/assets/styles/keyboard-exercises.css')
    console.log('Assets préchargés avec succès')
  } catch (error) {
    console.error('Erreur lors du préchargement des assets:', error)
  }
}

// Fonction principale de préchargement
export const preloadCriticalResources = async () => {
  await Promise.all([
    preloadComponents(),
    preloadAssets()
  ])
} 

export const preloadExercise = async (type) => {
  const component = {
    'mots': () => import('@/components/keyboard/AzuretyKeyboard.vue'),
    'lettres': () => import('@/components/keyboard/AzuretyKeyboard.vue'),
    'phrases': () => import('@/components/keyboard/AzuretyKeyboard.vue'),
    'symboles': () => import('@/components/keyboard/AzuretyKeyboard.vue')
  }
  try {
    await Promise.all([
      component[type](),
      import('@/components/RestartModal.vue'),
      import('@/components/ProgressBar.vue'),
      import('@/assets/styles/keyboard-exercises.css')
    ])
    console.log(`${type} préchargé avec succès`)
  } catch (error) {
    console.error(`Erreur lors du préchargement de ${type}:`, error)
  }
}


