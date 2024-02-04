import { createRouter, createWebHistory } from 'vue-router'
import ADashboard from '@/views/MainViews/ADashboard.vue'
import AUserManagement from '@/views/MainViews/AUserManagement.vue'
import AMasterDataMaintenance from '@/views/MainViews/AMasterDataMaintenance.vue'
import AKeyFigures from '@/views/DashboardViews/AKeyFigures.vue'
import ATourData from '@/views/DashboardViews/ATourData.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ADashboard
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: ADashboard,
      children: [
        {
          path: '',
          name: 'dashboard-default',
          redirect: { name: 'key-figures' }
        },
        {
          path: '/dashboard/key-figures',
          name: 'key-figures',
          component: AKeyFigures
        },
        {
          path: '/dashboard/tour-data',
          name: 'tour-data',
          component: ATourData
        }
      ]
    },
    {
      path: '/user-management',
      name: 'user-management',
      component: AUserManagement
    },
    {
      path: '/master-data-maintenance',
      name: 'master-data-maintenance',
      component: AMasterDataMaintenance
    }
  ]
})
