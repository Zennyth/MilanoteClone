<template>
  <span
    class="material-symbols-outlined option-resize"
    ref="resize"
    :class="{ resizing: isDragging }"
  >
    filter_list
  </span>
</template>

<script setup lang="ts">
import { ref, computed, watch, Ref } from 'vue'
import { BoardComponentData } from '../types';

import { useDrag } from '@/composables/drag'
import { storeToRefs } from 'pinia'
import { useBoardStore } from '@/store/modules/boardStore'

const resize = ref<HTMLDivElement>()
const props = defineProps(['modelValue', 'anchor'])
const emit = defineEmits(['update:modelValue'])

const component: Ref<BoardComponentData> = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const boardStore = useBoardStore()
const { snapVector2 } = boardStore;
const { board } = storeToRefs(boardStore)

const { isDragging } = useDrag({
  element: resize,
  onDragging: (event) => {
    const relative = {
      x: event.clientX - (board.value?.getBoundingClientRect().left ?? 0) - component.value.position.x,
      y: event.clientY - (board.value?.getBoundingClientRect().top ?? 0) - component.value.position.y,
    }
    
    component.value.size = snapVector2(relative);
  }
})

watch(isDragging, () => {
  component.value.isDraggable = !isDragging.value
})
</script>

<style lang="scss">
.option-resize {
  position: absolute;
  color: white;
  rotate: -45deg;
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
