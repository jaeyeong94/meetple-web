import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import mixpanel from 'mixpanel-browser'

const pageView = (page: string) => {
  mixpanel.track(`page_view:${page}`, { page });
};

mixpanel.init("3c1930afca4f02bcace4f1a9a83588e8", {
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

app.mount('#app')
