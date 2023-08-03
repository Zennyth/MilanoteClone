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
import { ref, inject, onMounted } from 'vue'
import { store } from '@/services/syncedstore'
import { boardStoreKey } from '@/keys'

import BoardComponent from './BoardComponent.vue'

const board = ref(null);
const boardStore = inject(boardStoreKey);

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
  store.components.forEach((c) => {
    c.isSelected = false
    c.isDragged = false
  })
})

const clickState = ref({
  isEvent: false,
  target: null,
  offset: { top: 0, left: 0 },

  isSelected: false,

  isDragging: false,
  hasMoved: false,
  timeout: null
})

const startDrag = (event, component) => {
  clickState.value.hasMoved = false
  clickState.value.target = component
  clickState.value.isEvent = true

  clickState.value.timeout = setTimeout(() => {
    clickState.value.isDragging = true
    clickState.value.target.isDragged = true
    clickState.value.offset.top = event.clientY - component.top
    clickState.value.offset.left = event.clientX - component.left
    clickState.value.timeout = null

    event.preventDefault()
  }, 100)
}

const move = (event) => {
  if (!clickState.value.isDragging) return

  clickState.value.target.left = boardStore.computeSnapValue(event.clientX - clickState.value.offset.left);
  clickState.value.target.top = boardStore.computeSnapValue(event.clientY - clickState.value.offset.top);
  clickState.value.hasMoved = true;
}

const stopDrag = (event) => {
  clickState.value.isDragging = false
  if (clickState.value.target !== null) {
    clickState.value.target.isDragged = false
  }

  if (!clickState.value.isEvent) {
    if (clickState.value.target !== null) {
      clickState.value.target.isSelected = false
    }

    clickState.value.target = null
    clickState.value.hasMoved = false
    return
  }

  clickState.value.isEvent = false
  clearTimeout(clickState.value.timeout)

  event.preventDefault()

  if (!clickState.value.hasMoved) {
    clickState.value.isSelected = true
    clickState.value.target.isSelected = true
    return
  }

  clickState.value.target = null
}
</script>

<style lang="scss">
</style>
