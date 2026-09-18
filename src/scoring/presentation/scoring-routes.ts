import type { RouteRecordRaw } from 'vue-router'

export const scoringRoutes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'scoring-evaluation',
    component: () => import('./views/credit-score-evaluation-view.vue'),
    meta: { title: 'Evaluación Scoring' }
  }
]

export default scoringRoutes
