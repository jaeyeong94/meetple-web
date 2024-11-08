import HistoryView from '@/views/HistoryView.vue'
import LoginView from '@/views/LoginView.vue'
import PhoneNumberCodeAuth from '@/views/PhoneNumberCodeAuth.vue'
import RegisterView from '@/views/RegisterView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import ProfileEditView from '@/views/ProfileEditView.vue'
import FormView from '@/views/FormView.vue'
import PointView from '@/views/PointView.vue'
import NotificationView from '@/views/NotificationView.vue'
import AgreementView from '@/views/RegisterView.vue'
import SignUpView from '@/views/LoginView.vue'
import StartView from '@/views/StartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'start',
      component: StartView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/login/code',
      name: 'login-code',
      component: PhoneNumberCodeAuth
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },


    {
      path: '/notification',
      name: 'notification',
      component: NotificationView
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
      path: '/point',
      name: 'point',
      component: PointView
    },
  ]
})

export default router
