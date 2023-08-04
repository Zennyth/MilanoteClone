import { App, Plugin } from 'vue';

import Card from '@/components/board/components/Card.vue';
import Editor from '@/components/board/components/Editor.vue';
import Image from '@/components/board/components/Image.vue';

export const BoardPlugin: Plugin = {
  install(app: App) {
    app.component('CardBoard', Card);
    app.component('EditorBoard', Editor);
    app.component('ImageBoard', Image);
  }
}