import type { RouteRecordRaw } from 'vue-router'

export const financingRoutes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'simulations',
    component: () => import('./views/credit-simulation-creator-view.vue'),
    meta: { title: 'Simulaciones de Crédito' }
  },
  {
    path: 'history',
    name: 'simulations-history',
    component: () => import('./views/simulation-history-view.vue'),
    meta: { title: 'Historial de Simulaciones' }
  },
  {
    path: ':id',
    name: 'simulation-detail',
    component: () => import('./views/credit-simulation-creator-view.vue'),
    meta: { title: 'Detalle de Simulación' }
  }
]

export default financingRoutes
