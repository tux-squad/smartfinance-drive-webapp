import type { RouteRecordRaw } from 'vue-router'

const profilesRoutes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'profile-detail',
    component: () => import('./views/profile-view.vue'),
    meta: { title: 'Perfil de Cliente' }
  }
]

export default profilesRoutes
