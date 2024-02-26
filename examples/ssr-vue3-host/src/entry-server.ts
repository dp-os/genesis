import { defineServer } from 'genesis3'
import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'

export default defineServer({
  async render (context) {
    const { app } = createApp()
    const html = await renderToString(app, context)
    context.html = `<div id="app">${html}</div>`
  }
})
