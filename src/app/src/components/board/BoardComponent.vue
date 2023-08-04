<template>
  <div
    ref="boardComponent"
    class="board-component"
    :class="{
      draggable: !props.isDragging,
      dragged: component.isDragged,
      selected: component.isSelected
    }"
    :style="style"
  >
    <component
      :is="component.type"
      v-model="component"
      @mousedown="componentMousedown"
    />
  </div>
</template>

<script lang="ts" setup>
import { Ref, StyleValue, computed, ref, watch } from 'vue'
import { BoardComponentData } from './types'

const props = defineProps(['modelValue', 'isDragging'])
const emit = defineEmits(['update:modelValue', 'componentMousedown'])
const boardComponent = ref<HTMLDivElement>()
const DISTANCE_THRESHOLD_TRANSFORM = 5

const component: Ref<BoardComponentData> = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const style: Ref<StyleValue> = computed(() => ({
  position: 'absolute',
  left: component.value.position.x + 'px',
  top: component.value.position.y + 'px',
  with: component.value.size.x !== 0 ? `${component.value.size.x}px` : '',
  height: component.value.size.y !== 0 ? `${component.value.size.y}px` : ''
}))

function componentMousedown(event: MouseEvent) {
  emit('componentMousedown', event, component.value)
}

watch(
  () => component.value.isDragged,
  () => {
    if (component.value.isDragged) {
      return
    }

    boardComponent.value!.style.transform = ''
  }
)

watch([() => component.value.position.x, () => component.value.position.y], ([newX, newY], [oldX, oldY]) => {
  if (!component.value.isDragged) {
    return
  }

  const velocity = { x: newX - oldX, y: newY - oldY }
  const distance = Math.sqrt(velocity.x ** 2 + velocity.y ** 2)
  component.value.velocity = velocity

  if (distance < DISTANCE_THRESHOLD_TRANSFORM) {
    boardComponent.value!.style.transform = ''
    return
  }

  boardComponent.value!.style.transform = `
    rotate3d(
      ${-velocity.y},
      ${velocity.x},
      0,
      ${Math.log(distance) * 2}deg
    )
  `
})
</script>

<style lang="scss">
.board-component {
  position: relative;
}

.component-container {
  display: flex;
}
</style>
