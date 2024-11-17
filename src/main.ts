import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import MixpanelService from '@/lib/mixpanel'

const pageView = (page: string) => {
  mixpanel.trackPageView(page);
};

const mixpanel = new MixpanelService("3c1930afca4f02bcace4f1a9a83588e8", {
  debug: false,
  track_pageview: true,
  persistence: "localStorage",
});

router.afterEach((to) => {
  if(to.name === null) {
    return;
  }

  if (typeof to.name === 'string') {
    pageView(to.name)
  }
});

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.provide('rootDiv', document.getElementById('app'));
app.provide('mp', mixpanel);

app.mount('#app')
