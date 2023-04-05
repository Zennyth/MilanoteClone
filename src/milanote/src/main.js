import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import primevue from '@/plugins/primevue.js'
import syncedstore from '@/plugins/syncedstore.js'
import board from '@/plugins/board.js'

import '@/assets/styles.scss';

const app = createApp(App)
  .use(createPinia())
  .use(router)
  .use(primevue)
  .use(syncedstore)
  .use(board)

app.mount('#app')
