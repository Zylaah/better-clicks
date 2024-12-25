import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FileTreeView from '../views/FileTreeView.vue'
import ExerciseView from '../views/ExerciseView.vue'
import AboutView from '../views/AboutView.vue'
import UnderConstructionView from '../views/UnderConstructionView.vue'
import GuideExplorerView from '../views/GuideExplorerView.vue'
import KeyboardPhraseView from '../views/KeyboardPhraseView.vue'
import KeyboardExerciseMenu from '../views/KeyboardExerciseMenu.vue'
import KeyboardLettreView from '../views/KeyboardLettreView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/file-tree',
    name: 'file-tree',
    component: FileTreeView
  },
  {
    path: '/exercise/:exercise',
    name: 'exercise',
    component: ExerciseView,
    props: route => ({ exercise: JSON.parse(route.params.exercise) })
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/construction',
    name: 'construction',
    component: UnderConstructionView
  },
  {
    path: '/guide-explorer',
    name: 'guide-explorer',
    component: GuideExplorerView
  },
  {
    path: '/keyboard',
    name: 'keyboard-menu',
    component: KeyboardExerciseMenu
  },
  {
    path: '/keyboard',
    name: 'keyboard-phrase',
    component: KeyboardPhraseView
  },
  {
    path: '/keyboard',
    name: 'keyboard-lettre',
    component: KeyboardLettreView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
