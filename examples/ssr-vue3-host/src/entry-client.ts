import { createApp } from './main'

function start () {
  const { app } = createApp()
  app.mount('#app')
}

start()
