// Fonction pour précharger les composants critiques
export const preloadComponents = async () => {
  try {
    // Préchargement du clavier
    await import('@/components/keyboard/AzuretyKeyboard.vue')
    console.log('Clavier préchargé avec succès')
  } catch (error) {
    console.error('Erreur lors du préchargement des composants:', error)
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