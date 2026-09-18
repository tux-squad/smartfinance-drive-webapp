import type { RouteRecordRaw } from 'vue-router'

export const partnersRoutes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'financial-entities',
    component: () => import('./views/financial-entities-view.vue'),
    meta: { title: 'Entidades Financieras' }
  }
]

export default partnersRoutes
