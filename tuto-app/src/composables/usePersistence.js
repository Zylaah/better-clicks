import { ref, onMounted, onBeforeUnmount } from 'vue'
import { indexedDBService } from '@/services/indexedDB'

export function usePersistence(exerciseType) {
  const progress = ref(null)
  const stats = ref(null)
  const currentState = ref(null)

  // Charger les données au montage
  onMounted(async () => {
    try {
      progress.value = await indexedDBService.getProgress(exerciseType)
      stats.value = await indexedDBService.getStatsByType(exerciseType)
      currentState.value = await indexedDBService.getState(exerciseType)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    }
  })

  // Sauvegarder la progression
  const saveProgress = async (data) => {
    try {
      await indexedDBService.saveProgress(exerciseType, {
        completionRate: data.completionRate,
        lastAccess: Date.now(),
        ...data
      })
      progress.value = await indexedDBService.getProgress(exerciseType)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la progression:', error)
    }
  }

  // Sauvegarder les statistiques
  const saveStats = async (data) => {
    try {
      await indexedDBService.saveStats({
        exerciseType,
        ...data
      })
      stats.value = await indexedDBService.getStatsByType(exerciseType)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des statistiques:', error)
    }
  }

  // Sauvegarder l'état actuel
  const saveState = async (data) => {
    try {
      await indexedDBService.saveState({
        exerciseType,
        ...data
      })
      currentState.value = await indexedDBService.getState(exerciseType)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'état:', error)
    }
  }

  // Nettoyer les anciennes données au démontage
  onBeforeUnmount(async () => {
    try {
      await indexedDBService.clearOldData()
    } catch (error) {
      console.error('Erreur lors du nettoyage des données:', error)
    }
  })

  return {
    progress,
    stats,
    currentState,
    saveProgress,
    saveStats,
    saveState
  }
} 