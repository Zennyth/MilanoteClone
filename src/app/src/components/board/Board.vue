<template>
  <div
    class="board"
    ref="board"
    @mousemove="mousemove"
    @mouseup="mouseup"
    @click.right="rightClick"
  >
    <BoardComponent
      v-for="(component, index) in components"
      :key="component.id"
      v-model="components[index]"
      :is-dragging="interaction.isDragging"
      @component-mousedown="mousedown"
    >
    </BoardComponent>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import BoardComponent from '@/components/board/BoardComponent.vue'
import { useBoardStore } from '@/store/modules/boardStore'
import { BoardComponentData, createDefaultComponent } from './types'
import { storeToRefs } from 'pinia'

const board = ref<HTMLDivElement>()
const boardStore = useBoardStore()
const { interaction } = boardStore
const { components } = storeToRefs(boardStore)

function rightClick(event: MouseEvent) {
  event.preventDefault()

  boardStore.addComponent(createDefaultComponent('ImageBoard', event.pageY, event.pageX))
  // src: 'https://i.pinimg.com/564x/c5/ba/1a/c5ba1ad1bc19880c8f756ed73c9b89d3.jpg'
}

onMounted(() => {
  boardStore.openBoard(board.value, '')
})

const mousedown = (event: MouseEvent, component: BoardComponentData) => {
  interaction.hasMoved = false
  interaction.target = component
  interaction.isEvent = true

  interaction.timeout = setTimeout(() => {
    if (component.isDraggable === false) {
      return
    }

    interaction.isDragging = true
    component.isDragged = true
    interaction.offset.x = event.clientX - component.position.x
    interaction.offset.y = event.clientY - component.position.y
    interaction.timeout = undefined

    event.preventDefault()
  }, 100)
}

const mousemove = (event: MouseEvent) => {
  if (!interaction.isDragging || interaction.target === undefined) return

  interaction.target!.position.x = event.clientX - interaction.offset.x
  interaction.target!.position.y = event.clientY - interaction.offset.y
  interaction.hasMoved = true
}

const mouseup = (event: MouseEvent) => {
  interaction.isDragging = false

  if (interaction.target !== undefined) {
    interaction.target!.isDragged = false
    interaction.target!.position = boardStore.snapVector2(interaction.target!.position)
  }

  if (!interaction.isEvent) {
    if (interaction.target !== undefined) {
      interaction.target!.isSelected = false
    }
    interaction.hasMoved = false
    return
  }

  interaction.isEvent = false
  clearTimeout(interaction.timeout)
  event.preventDefault()

  if (!interaction.hasMoved) {
    interaction.isSelected = true
    interaction.target!.isSelected = true
    return
  }
  interaction.target = undefined
}
</script>

<style lang="scss"></style>
