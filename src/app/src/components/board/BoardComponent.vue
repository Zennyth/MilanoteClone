<template>
  <div
    class="board-component"
    :class="{
      draggable: !props.isDragging,
      dragged: component.isDragged,
      selected: component.isSelected
    }"
    :style="style"
  >
    <component :is="component.type" v-model="component" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['modelValue', 'isDragging'])
const emit = defineEmits(['update:modelValue'])

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
</script>

<style lang="scss">
.board-component {
  position: relative;
}
</style>
