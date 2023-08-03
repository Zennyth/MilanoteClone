<template>
  <i ref="resize" class="pi pi-caret-right option-resize" :class="{ resizing: isDragging }"></i>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue'

import { useDrag } from '@/composables/drag'
import { boardStoreKey } from '@/keys'

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

const boardStore = inject(boardStoreKey)

const { isDragging } = useDrag(resize, (event) => {
  const relative = {
    x: event.clientX - boardStore.board.getBoundingClientRect().left,
    y: event.clientY - boardStore.board.getBoundingClientRect().top
  }


  component.value.width = boardStore.computeSnapValue(relative.x - component.value.left)
  component.value.height = boardStore.computeSnapValue(relative.y - component.value.top)
})

watch(isDragging, () => {
  component.value.isDraggable = !isDragging.value;
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
