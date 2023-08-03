import Card from '@/components/board/components/Card.vue';
import Editor from '@/components/board/components/Editor.vue';
import Image from '@/components/board/components/Image.vue';

export default {
  install(app) {
    app.component('CardBoard', Card);
    app.component('EditorBoard', Editor);
    app.component('ImageBoard', Image);

    app.config.warnHandler = function (msg, vm, trace) {
      if (msg.includes('Extraneous non-emits event listeners (mousedown)')) {
        return
      }
      console.warn(msg, trace)
    }
  }
}