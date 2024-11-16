import ProfileSettingView from '@/views/ProfileSettingView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HistoryProfileView from '@/views/HistoryProfileView.vue'
import HistoryView from '@/views/HistoryView.vue'
import LoginView from '@/views/LoginView.vue'
import MatchProfileView from '@/views/MatchProfileView.vue'
import PhoneNumberCodeAuth from '@/views/PhoneNumberCodeAuth.vue'
import RegisterView from '@/views/RegisterView.vue'
import MatchView from '@/views/MatchView.vue'
import ProfileView from '@/views/ProfileView.vue'
import ProfileEditView from '@/views/ProfileEditView.vue'
import PointView from '@/views/PointView.vue'
import NotificationView from '@/views/NotificationView.vue'
import StartView from '@/views/StartView.vue'
import ProfilePreviewView from '@/views/ProfilePreviewView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'start',
      component: StartView
    },
    {
      path: '/match',
      name: 'match',
      component: MatchView
    },
    {
      path: '/match/profile/:id',
      name: 'match-profile',
      component: MatchProfileView
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView
    },
    {
      path: '/history/profile/:id',
      name: 'history-profile',
      component: HistoryProfileView
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
      path: '/register/:stage',
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
      path: '/profile-setting',
      name: 'profile-setting',
      component: ProfileSettingView
    },
    {
      path: '/profile-edit',
      name: 'profile-edit',
      component: ProfileEditView
    },
    {
      path: '/profile-preview',
      name: 'profile-preview',
      component: ProfilePreviewView
    },
    {
      path: '/point',
      name: 'point',
      component: PointView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/',
    }
  ]
})

export default router
