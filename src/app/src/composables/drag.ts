import { ref, onMounted, onUnmounted, Ref } from 'vue'

interface DragConfiguration {
  element: Ref<HTMLDivElement | undefined>;
  onStartDragging?(event: MouseEvent): void;
  onDragging?(event: MouseEvent): void;
  onStopDragging?(): void;
}

export function useDrag(configuration: DragConfiguration) {
  const isDragging = ref(false);

  function startDragging(event: MouseEvent) {
    isDragging.value = true;
    configuration.onStartDragging?.(event);
    event.preventDefault();
  }

  function dragging(event: MouseEvent) {
    if(isDragging.value) {
      configuration.onDragging?.(event);
    }
  }

  function stopDragging() {
    isDragging.value = false;
    configuration.onStopDragging?.();
  }



  onMounted(() => {
    configuration.element.value?.addEventListener('mousedown', startDragging);
    window.addEventListener('mousemove', dragging);
    window.addEventListener('mouseup', stopDragging);
  });
  onUnmounted(() => {
    configuration.element.value?.removeEventListener('mousedown', startDragging);
    window.removeEventListener('mousemove', dragging);
    window.removeEventListener('mouseup', stopDragging);
  });

  return { isDragging }
}