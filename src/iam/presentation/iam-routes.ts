import type { RouteRecordRaw } from 'vue-router'

const iamRoutes: Array<RouteRecordRaw> = [
  {
    path: '/iam/sign-in',
    name: 'sign-in',
    component: () => import('./views/sign-in-view.vue'),
    meta: { title: 'Iniciar Sesión', guestOnly: true }
  },
  {
    path: '/iam/sign-up',
    name: 'sign-up',
    component: () => import('./views/sign-up-view.vue'),
    meta: { title: 'Registrarse', guestOnly: true }
  },
  {
    path: '/iam/forgot-password',
    name: 'forgot-password',
    component: () => import('./views/forgot-password-view.vue'),
    meta: { title: 'Recuperar Contraseña', guestOnly: true }
  },
  {
    path: '/iam/reset-password',
    name: 'reset-password',
    component: () => import('./views/reset-password-view.vue'),
    meta: { title: 'Restablecer Contraseña', guestOnly: true }
  }
]

export default iamRoutes
