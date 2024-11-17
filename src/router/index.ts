import http from '@/lib/http'
import MixpanelService from '@/lib/mixpanel'
import ProfileSettingView from '@/views/ProfileSettingView.vue'
import { createRouter, createWebHistory, type RouteLocation, type RouteLocationNormalizedGeneric } from 'vue-router'
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

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  mixPanelUserSet(to, from);
  next();
});

const mixpanel = new MixpanelService("3c1930afca4f02bcace4f1a9a83588e8", {
  debug: false,
  track_pageview: true,
  persistence: "localStorage",
});

mixpanel.resetUser();

function mixPanelUserSet(to: RouteLocationNormalizedGeneric, from: RouteLocationNormalizedGeneric) {
  const token = localStorage.getItem('token');

  // Page view tracking
  if (typeof to.name === 'string') {
    mixpanel.trackPageView(to.name)
  }

  // User tracking
  if(mixpanel.userInfo === null && token) {
    http.get('/account').then((response) => {
      const user = response.data.data;
      mixpanel.setUser({
        id: user.id,
        name: user.name,
        phone_number: user.phone_number,
        birth_date: user.birth_date,
        nick_name: user.accountMeta.nick_name,
        occupied_area_high: user.accountMeta.occupied_area_high,
        occupied_area_low: user.accountMeta.occupied_area_low,
        job: user.accountMeta.job,
        school: user.accountMeta.school,
      });
    }).catch((error) => {
      console.log('Mixpanel user set error');
    });
  }
}

export default router
