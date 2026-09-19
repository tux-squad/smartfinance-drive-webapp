import type { RouteRecordRaw } from 'vue-router'

export const partnersRoutes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'concessionaires-directory',
    component: () => import('./views/concessionaires-directory-view.vue'),
    meta: { title: 'Concesionarias Aliadas' }
  },
  {
    path: 'entities',
    name: 'financial-entities',
    component: () => import('./views/financial-entities-view.vue'),
    meta: { title: 'Entidades Financieras' }
  },
  {
    path: ':id',
    name: 'concessionaire-detail',
    component: () => import('./views/concessionaire-detail-view.vue'),
    meta: { title: 'Inventario de Concesionaria' }
  }
]

export default partnersRoutes
