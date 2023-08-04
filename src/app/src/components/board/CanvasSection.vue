<template>
  <div class="canvas-section">
    <div ref="viewport" class="canvas-viewport" data-scrollable="true" @mousedown="mousedown">
      <div class="canvas-scroll-area">
        <Board />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue';
import Board from './Board.vue';

const viewport: Ref<HTMLDivElement | undefined> = ref();
const position = ref({
  top: 0, left: 0, x: 0, y: 0
});

// handle grabbing
const mousedown = (event: MouseEvent) => {
  if (event.which !== 2) {
    return;
  }

  position.value = {
    left: viewport.value!.scrollLeft,
    top: viewport.value!.scrollTop,
    x: event.clientX,
    y: event.clientY
  }

  viewport.value!.style.cursor = 'grabbing';
  viewport.value!.style.userSelect = 'none';

  document.addEventListener('mousemove', mousemove);
  document.addEventListener('mouseup', mouseup);

  event.preventDefault();
}

const mousemove = (event: MouseEvent) => {
  // How far the mouse has been moved
  const dx = event.clientX - position.value.x;
  const dy = event.clientY - position.value.y;

  // Scroll the element
  viewport.value!.scrollTop = position.value.top - dy;
  viewport.value!.scrollLeft = position.value.left - dx;
}

const mouseup = (_event: MouseEvent) => {
  document.removeEventListener('mousemove', mousemove);
  document.removeEventListener('mouseup', mouseup);

  viewport.value!.style.cursor = 'grab';
  viewport.value!.style.removeProperty('user-select');
}
</script>