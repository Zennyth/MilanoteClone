import { createPinia } from 'pinia'
import { markRaw } from 'vue'
import router from '@/router'

import {
  boardStoreKey,
} from '@/keys'

import { useBoardStore } from './modules/boardStore'

export default {
  install(app) {
    const pinia = createPinia();

    pinia.use(({ store }) => {
      store.router = markRaw(router);
    });

    app.use(pinia);

    app.provide(boardStoreKey, useBoardStore());
  }
}
