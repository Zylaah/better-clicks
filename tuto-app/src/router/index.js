import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/file-tree',
    name: 'file-tree',
    component: () => import('../views/explorerexercises/FileTreeView.vue')
  },
  {
    path: '/exercise/:exercise',
    name: 'exercise',
    component: () => import('../views/explorerexercises/ExerciseView.vue'),
    props: route => ({ exercise: JSON.parse(route.params.exercise) })
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/construction',
    name: 'construction',
    component: () => import('../views/UnderConstructionView.vue')
  },
  {
    path: '/guide-explorer',
    name: 'guide-explorer',
    component: () => import('../views/GuideExplorerView.vue')
  },
  {
    path: '/keyboard',
    name: 'keyboard-menu',
    component: () => import('../views/keyboardexercises/KeyboardExerciseMenu.vue')
  },
  {
    path: '/keyboard',
    name: 'keyboard-phrase',
    component: () => import('../views/keyboardexercises/KeyboardPhraseView.vue')
  },
  {
    path: '/keyboard',
    name: 'keyboard-lettre',
    component: () => import('../views/keyboardexercises/KeyboardLettreView.vue')
  },
  {
    path: '/keyboard',
    name: 'keyboard-symboles',
    component: () => import('../views/keyboardexercises/KeyboardSymbolesView.vue')
  },
  {
    path: '/keyboard',
    name: 'keyboard-mots',
    component: () => import('../views/keyboardexercises/KeyboardMotView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
