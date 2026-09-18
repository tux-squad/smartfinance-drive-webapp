import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/search-vehicles'
    },
    
    {
      path: '/search-vehicles',
      name: 'search-vehicles',
      component: () => import('../views/vehicles.vue')
    },
    {
      path: '/configuration',
      name: 'configuration',
      component: () => import('../views/configuration.vue')
    },
    {
      path: '/consultations',
      name: 'consultations',
      component: () => import('../views/consultation.vue')
    },
    {
      path: '/concessionaries',
      name: 'concessionaries',
      component: () => import('../views/concessionary.vue')
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/report.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/user.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/search-vehicles'
    }
  ],
})

export default router
