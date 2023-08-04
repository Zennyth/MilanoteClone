import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import { StorePlugin } from '@/store'
import { PrimevuePlugin } from '@/plugins/primevue'
import { SyncedstorePlugin } from '@/plugins/syncedstore'
import { BoardPlugin } from '@/plugins/board'

import '@/assets/styles.scss'

const app = createApp(App)
  .use(StorePlugin)
  .use(router)
  .use(PrimevuePlugin)
  .use(SyncedstorePlugin)
  .use(BoardPlugin)

app.mount('#app')
