import { defineNode, createServer } from 'genesis3'

export default defineNode({
  name: 'ssr-vue3-host',
  federation: {
    // exposes: ['src/common-button.vue', 'src/utils.ts'],
    remotes: [
      {
        name: 'ssr-vue3-remote',
        clientOrigin: 'http://localhost:3003',
        serverOrigin: 'http://localhost:3003'
      }
    ]
  },
  created (genesis) {
    const server = createServer(genesis)
    server.listen(3004, () => {
      console.log('http://localhost:3004')
    })
  }
})
