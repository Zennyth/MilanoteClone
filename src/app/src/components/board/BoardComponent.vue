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
      @mousedown="($event) => componentMousedown($event, component)"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps(['modelValue', 'isDragging'])
const emit = defineEmits(['update:modelValue', 'componentMousedown'])
const boardComponent = ref(null)
const DISTANCE_THRESHOLD_TRANSFORM = 5

const component = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const style = computed(() => ({
  position: 'absolute',
  top: component.value.top + 'px',
  left: component.value.left + 'px',
  with: component.value.with + 'px',
  height: component.value.height + 'px'
}))

function componentMousedown(event) {
  emit('componentMousedown', event, component)
}

watch(
  () => component.value.isDragged,
  () => {
    if (component.value.isDragged) {
      return
    }

    boardComponent.value.style.transform = ''
  }
)

watch([() => component.value.left, () => component.value.top], ([newX, newY], [oldX, oldY]) => {
  if (!component.value.isDragged) {
    return
  }

  const velocity = { x: newX - oldX, y: newY - oldY }
  const distance = Math.sqrt(velocity.x ** 2 + velocity.y ** 2)
  component.value.velocity = velocity

  if (distance < DISTANCE_THRESHOLD_TRANSFORM) {
    boardComponent.value.style.transform = ''
    return
  }

  boardComponent.value.style.transform = `
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
