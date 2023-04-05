<template>
  <div class="board" v-on:click.right="addComponent">
    <component
      v-for="(component, index) in store.components"
      :is="component.type"
      :key="component.id"
      v-model="store.components[index]"

      @mousedown="$event => drag($event, store.components[index])" 
      @mouseup="$event => stopDrag($event, store.components[index])" 
      @mousemove="$event => move($event, store.components[index])"
      
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

const isDragging = ref(false);
const dragOffest = ref({
  top: 0,
  left: 0
})

const drag = (event, component) => {
  isDragging.value = true;
  dragOffest.value.top = event.clientY - component.top;
  dragOffest.value.left = event.clientX - component.left;
  event.preventDefault();
}

const move = (event, component) => {
  if(!isDragging.value)
    return;
  
  component.left = event.clientX - dragOffest.value.left;
  component.top = event.clientY - dragOffest.value.top;
}

const stopDrag = (event, component) => {
  isDragging.value = false;
  event.preventDefault();
}
</script>

<style lang="scss">
.draggable {
  cursor: grab;
}

.dragging {
  cursor: grabbing;
}
</style>