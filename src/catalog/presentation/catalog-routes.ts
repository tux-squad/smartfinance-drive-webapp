import type { RouteRecordRaw } from 'vue-router'

export const catalogRoutes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'vehicle-catalog',
    component: () => import('./views/vehicle-catalog-view.vue'),
    meta: { title: 'Catálogo de Vehículos', public: true }
  },
  {
    path: ':id',
    name: 'vehicle-detail',
    component: () => import('./views/vehicle-detail-view.vue'),
    meta: { title: 'Detalle del Vehículo', public: true }
  }
]

export default catalogRoutes
