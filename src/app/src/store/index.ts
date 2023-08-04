import { createPinia } from 'pinia'
import { App, Plugin, markRaw } from 'vue'
import router from '@/router'

export const StorePlugin: Plugin = {
  install(app: App) {
    const pinia = createPinia();

    pinia.use(({ store }) => {
      store.router = markRaw(router);
    });

    app.use(pinia);
  }
}
