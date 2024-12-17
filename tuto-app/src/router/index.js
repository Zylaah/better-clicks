import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FileTreeView from '../views/FileTreeView.vue'
import ExerciseView from '../views/ExerciseView.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
