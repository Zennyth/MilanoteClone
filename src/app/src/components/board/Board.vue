<template>
  <div 
    class="board" 
    @mousemove="$event => move($event, store.components[index])"
    @mouseup="$event => stopDrag($event, store.components[index])" 
    @click.right="addComponent"
  >
    <component
      v-for="(component, index) in store.components"
      :is="component.type"
      :key="component.id"
      v-model="store.components[index]"

      @mousedown="$event => startDrag($event, store.components[index])" 
      
      :class="{
        'draggable': !isDragging,
        'dragging': isDragging
      }"
    >
    </component>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { store } from '@/services/syncedstore'

function addComponent(event) {
  event.preventDefault()

  store.components.push({
    id: Date.now(),
    type: 'EditorBoard',
    top: event.pageY,
    left: event.pageX,
    text: ""
  })
}

const drag = ref({
  target: null,
  offset: {top: 0, left: 0},
  isDragging: false,
  timeout: null,
})

const startDrag = (event, component) => {
  drag.value.timeout = setTimeout(() => {
    drag.value.isDragging = true;
    drag.value.target = component;
    drag.value.offset.top = event.clientY - component.top;
    drag.value.offset.left = event.clientX - component.left;
    drag.value.timeout = null;
    event.preventDefault();
  }, 100);
}

const move = (event) => {
  if(!drag.value.isDragging)
    return;
  
  drag.value.target.left = event.clientX - drag.value.offset.left;
  drag.value.target.top = event.clientY - drag.value.offset.top;
}

const stopDrag = (event) => {
  if(drag.value.timeout !== null) {
    clearTimeout(drag.value.timeout);
    return;
  }

  drag.value.isDragging = false;
  drag.value.target = null;
  event.preventDefault();
}
</script>

<style lang="scss">
// .draggable {
//   cursor: grab;
// }

// .dragging {
//   cursor: grabbing;
// }
</style>