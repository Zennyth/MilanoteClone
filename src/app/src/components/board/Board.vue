<template>
  <div
    class="board"
    ref="board"
    @mousemove="($event) => move($event)"
    @mouseup="($event) => stopDrag($event)"
    @click.right="addComponent"
  >
    <BoardComponent
      v-for="(component, index) in store.components"
      :key="component.id"
      v-model="store.components[index]"
      :is-dragging="clickState.isDragging"
      @component-mousedown="startDrag"
    >
    </BoardComponent>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, unref } from 'vue'
import { store } from '@/services/syncedstore'
import { boardStoreKey } from '@/keys'

import BoardComponent from '@/components/board/BoardComponent.vue';

const board = ref(null)
const boardStore = inject(boardStoreKey)

function addComponent(event) {
  event.preventDefault()

  store.components.push({
    id: Date.now(),
    type: 'ImageBoard',
    top: event.pageY,
    left: event.pageX,
    src: 'https://i.pinimg.com/564x/c5/ba/1a/c5ba1ad1bc19880c8f756ed73c9b89d3.jpg'
  })
}

onMounted(() => {
  boardStore.openBoard(board);

  store.components.forEach((c) => {
    c.isSelected = false
    c.isDragged = false
  })
})

const clickState = {
  isEvent: false,
  target: null,
  offset: { top: 0, left: 0 },

  isSelected: false,

  isDragging: false,
  hasMoved: false,
  timeout: null
}

const startDrag = (event, component) => {
  clickState.hasMoved = false;
  clickState.target = component;
  clickState.isEvent = true;

  clickState.timeout = setTimeout(() => {
    if(clickState.target.value.isDraggable === false) {
      return;
    }

    clickState.isDragging = true;
    clickState.target.value.isDragged = true;
    clickState.offset.top = event.clientY - clickState.target.value.top;
    clickState.offset.left = event.clientX - clickState.target.value.left;
    clickState.timeout = null;

    event.preventDefault();
  }, 100)
}

const move = (event) => {
  if (!clickState.isDragging) return

  clickState.target.value.left = boardStore.computeSnapValue(
    event.clientX - clickState.offset.left
  )
  clickState.target.value.top = boardStore.computeSnapValue(
    event.clientY - clickState.offset.top
  )
  clickState.hasMoved = true
}

const stopDrag = (event) => {
  clickState.isDragging = false
  if (clickState.target !== null && clickState.target.value !== null) {
    clickState.target.value.isDragged = false
  }

  if (!clickState.isEvent) {
    if (clickState.target !== null && clickState.target.value !== null) {
      clickState.target.value.isSelected = false
    }

    clickState.hasMoved = false
    return
  }

  clickState.isEvent = false
  clearTimeout(clickState.timeout)

  event.preventDefault()

  if (!clickState.hasMoved) {
    clickState.isSelected = true
    clickState.target.value.isSelected = true
    return
  }

  unref(clickState.target)
}
</script>

<style lang="scss">
</style>
