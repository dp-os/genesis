import { createSSRApp } from 'vue'
import App from './app.vue'

export function createApp () {
  const app = createSSRApp(App)
  return { app }
}
