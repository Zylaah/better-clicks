import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FileTreeView from '../views/explorerexercises/FileTreeView.vue'
import ExerciseView from '../views/explorerexercises/ExerciseView.vue'
import AboutView from '../views/AboutView.vue'
import UnderConstructionView from '../views/UnderConstructionView.vue'
import GuideExplorerView from '../views/GuideExplorerView.vue'
import KeyboardPhraseView from '../views/keyboardexercises/KeyboardPhraseView.vue'
import KeyboardExerciseMenu from '../views/keyboardexercises/KeyboardExerciseMenu.vue'
import KeyboardLettreView from '../views/keyboardexercises/KeyboardLettreView.vue'
import KeyboardSymbolesView from '../views/keyboardexercises/KeyboardSymbolesView.vue'
import KeyboardMotView from '../views/keyboardexercises/KeyboardMotView.vue'

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
  },
  {
    path: '/keyboard',
    name: 'keyboard-symboles',
    component: KeyboardSymbolesView
  },
  {
    path: '/keyboard',
    name: 'keyboard-mots',
    component: KeyboardMotView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
