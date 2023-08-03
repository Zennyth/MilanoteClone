<template>
  <i ref="resize" class="pi pi-caret-right option-resize" :class="{ resizing: isDragging }"></i>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDrag } from '@/composables/drag'

const resize = ref(null)
const props = defineProps(['modelValue', 'anchor'])
const emit = defineEmits(['update:modelValue'])

const component = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const snapToGrid = ref(true)
const snapSettings = ref({
  gridSize: 22
})
function snapValueToGrid(val, gridSize) {
  var snap_candidate = gridSize * Math.round(val / gridSize)
  if (val - snap_candidate < 2) {
    return snap_candidate
  } else {
    return null
  }
}

const { isDragging } = useDrag(resize, (event) => {
  component.value.width = event.clientX - component.value.left
  component.value.height = event.clientY - component.value.top

  if (snapToGrid.value) {
    component.value.width = snapValueToGrid(component.value.width, snapSettings.value.gridSize)
    component.value.height = snapValueToGrid(component.value.height, snapSettings.value.gridSize)
  }
})

const style = computed(() => ({
  cursor: 'nw-resize'
}))
</script>

<style lang="scss">
.option-resize {
  position: absolute;
  color: white;
  rotate: 45deg;
  bottom: 0;
  right: 0;

  &:hover {
    cursor: nw-resize;
  }
}

.resizing {
  cursor: nw-resize;
}
</style>
