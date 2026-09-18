import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '@/shared/presentation/views/app-layout.vue'
import iamRoutes from '@/iam/presentation/iam-routes'
import profilesRoutes from '@/profiles/presentation/profiles-routes'
import catalogRoutes from '@/catalog/presentation/catalog-routes'
import partnersRoutes from '@/partners/presentation/partners-routes'
import financingRoutes from '@/financing/presentation/financing-routes'
import { authenticationGuard } from '@/iam/infrastructure/authentication.guard'

const routes: Array<RouteRecordRaw> = [
  // Full-page standalone Authentication routes (outside AppLayout / sidebar)
  {
    path: '/iam',
    redirect: { name: 'sign-in' },
    children: iamRoutes
  },

  // Main application routes wrapped in AppLayout (with Header & Sidebar)
  {
    path: '/',
    component: AppLayout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/shared/presentation/views/home-view.vue'),
        meta: { title: 'Inicio', public: true }
      },
      {
        path: 'user',
        children: profilesRoutes
      },
      {
        path: 'vehicles',
        children: catalogRoutes
      },
      {
        path: 'concessionaries',
        children: partnersRoutes
      },
      {
        path: 'simulations',
        children: financingRoutes
      },
      {
        path: 'scoring',
        name: 'scoring',
        component: () => import('@/shared/presentation/views/home-view.vue'),
        meta: { title: 'Evaluación Scoring' }
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/shared/presentation/views/home-view.vue'),
        meta: { title: 'Depreciación y Reportes' }
      },
      {
        path: 'billing',
        name: 'billing',
        component: () => import('@/shared/presentation/views/home-view.vue'),
        meta: { title: 'Suscripción y Planes' }
      }
    ]
  },

  // Fallback 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/shared/presentation/views/not-found-view.vue'),
    meta: { title: 'Página no encontrada', public: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const baseTitle = 'SmartFinance Drive Platform'
  document.title = to.meta.title ? `${baseTitle} - ${to.meta.title}` : baseTitle
  return authenticationGuard(to, from, next)
})

export default router
