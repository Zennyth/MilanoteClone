import Card from '@/components/board/components/Card.vue'

export default {
  install(app) {
    app.component('CardBoard', Card);
  }
}