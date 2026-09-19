import type { RouteRecordRaw } from 'vue-router'

const projectionsRoutes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: { name: 'vehicle-depreciation' }
  },
  {
    path: 'depreciation',
    name: 'vehicle-depreciation',
    component: () => import('./views/vehicle-depreciation-view.vue'),
    meta: {
      title: 'Depreciación Vehicular (5 Años)'
    }
  }
]

export default projectionsRoutes
