import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'document-preview',
      component: HomeView,
    },
    {
      path: '/preview',
      name: 'file-preview',
      component: () => import('../views/FilePreviewView.vue'),
    },
    {
      path: '/viewer',
      name: 'pure-file-viewer',
      component: () => import('../views/PureFileView.vue'),
    },
  ],
})
