import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '@/shared/presentation/views/app-layout.vue'
import iamRoutes from '@/iam/presentation/iam-routes'
import { authenticationGuard } from '@/iam/infrastructure/authentication.guard'

const routes: Array<RouteRecordRaw> = [
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
        path: 'iam',
        name: 'iam',
        children: iamRoutes
      },
      {
        path: 'vehicles',
        name: 'vehicles',
        component: () => import('@/shared/presentation/views/home-view.vue'),
        meta: { title: 'Catálogo de Vehículos' }
      },
      {
        path: 'concessionaries',
        name: 'concessionaries',
        component: () => import('@/shared/presentation/views/home-view.vue'),
        meta: { title: 'Entidades Financieras' }
      },
      {
        path: 'simulations',
        name: 'simulations',
        component: () => import('@/shared/presentation/views/home-view.vue'),
        meta: { title: 'Simulaciones de Crédito' }
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
        path: 'user',
        name: 'user',
        component: () => import('@/shared/presentation/views/home-view.vue'),
        meta: { title: 'Perfil de Usuario' }
      },
      {
        path: 'billing',
        name: 'billing',
        component: () => import('@/shared/presentation/views/home-view.vue'),
        meta: { title: 'Suscripción y Planes' }
      }
    ]
  },
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
