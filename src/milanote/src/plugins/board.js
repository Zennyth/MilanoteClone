import Card from '@/components/board/components/Card.vue';
import Editor from '@/components/board/components/Editor.vue';

export default {
  install(app) {
    app.component('CardBoard', Card);
    app.component('EditorBoard', Editor);
  }
}