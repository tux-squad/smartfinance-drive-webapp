import type { RouteRecordRaw } from 'vue-router'

export const catalogRoutes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'vehicle-catalog',
    component: () => import('./views/vehicle-catalog-view.vue'),
    meta: { title: 'Catálogo de Vehículos', public: true }
  },
  {
    path: 'compare',
    name: 'vehicle-compare',
    component: () => import('./views/vehicle-compare-view.vue'),
    meta: { title: 'Comparar Vehículos', public: true }
  },
  {
    path: ':id',
    name: 'vehicle-detail',
    component: () => import('./views/vehicle-detail-view.vue'),
    meta: { title: 'Detalle del Vehículo', public: true }
  },
  {
    path: ':id/pre-evaluation',
    name: 'pre-evaluation',
    component: () => import('./views/pre-evaluation-view.vue'),
    meta: { title: 'Pre-evaluación Crediticia' }
  }
]

export default catalogRoutes
