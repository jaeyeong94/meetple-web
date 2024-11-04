import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import ProfileEditView from '@/views/ProfileEditView.vue'
import FormView from '@/views/FormView.vue'
import PointView from '@/views/PointView.vue'
import NotificationView from '@/views/NotificationView.vue'
import AgreementView from '@/views/AgreementView.vue'
import SignUpView from '@/views/SignUpView.vue'
import StartView from '@/views/StartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/start',
      name: 'start',
      component: StartView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/profile-edit',
      name: 'profile-edit',
      component: ProfileEditView
    },
    {
      path: '/form',
      name: 'form',
      component: FormView
    },
    {
      path: '/point',
      name: 'point',
      component: PointView
    },
    {
      path: '/notification',
      name: 'notification',
      component: NotificationView
    },
    {
      path: '/agreement',
      name: 'agreement',
      component: AgreementView
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: SignUpView
    }
  ]
})

export default router
