import { ref, onMounted, onUnmounted } from 'vue'

export function useDrag(element, onDragging = (event) => {}) {
  const isDragging = ref(false);

  function startDragging(event) {
    isDragging.value = true;
    event.preventDefault();
  }

  function dragging(event) {
    if(isDragging.value) {
      onDragging(event);
    }
  }

  function stopDragging() {
    isDragging.value = false;
  }



  onMounted(() => {
    element.value.addEventListener('mousedown', startDragging);
    window.addEventListener('mousemove', dragging);
    window.addEventListener('mouseup', stopDragging);
  });
  onUnmounted(() => {
    element.value.removeEventListener('mousedown', startDragging);
    window.removeEventListener('mousemove', dragging);
    window.removeEventListener('mouseup', stopDragging);
  });

  return { isDragging }
}