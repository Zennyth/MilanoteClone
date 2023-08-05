import { App, Component } from 'vue';

import Editor from '@/components/board/components/Editor.vue';
import Image from '@/components/board/components/Image.vue';
import Column from '@/components/board/components/Column.vue';



interface RegisterBoardComponent {
  // vue
  name: string
  component: Component

  // custom
  icon: string
  label: string
}

interface IBoardPlugin {
  components: Array<RegisterBoardComponent>

  init(): void;
  register(name: string, component: Component, icon: string, label: string): void;
  install(app: App): void;
}

class BoardPlugin implements IBoardPlugin {
  components: RegisterBoardComponent[] = [];
  register(name: string, component: Component, icon: string, label: string): void {
    this.components.push({
      name,
      component,
      icon,
      label
    })
  }
  install(app: App): void {
    this.init();
    this.components.forEach(c => app.component(c.name, c.component))
  }

  init(): void {
		this.register('ImageBoard', Image, 'pi pi-fw pi-image', 'Image')
    this.register('ColumnBoard', Column, 'pi pi-fw pi-list', 'Column')
    this.register('EditorBoard', Editor, 'pi pi-fw pi-code', 'Editor')
  }
}


export const boardPlugin: BoardPlugin = new BoardPlugin();