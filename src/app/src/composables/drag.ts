import { ref, onMounted, onUnmounted, Ref } from 'vue'

interface DragConfiguration {
  element: Ref<HTMLDivElement | undefined>;

  enableDrag?(event: MouseEvent): boolean;
  onStartDragging?(event: MouseEvent): void;
  onDragging?(event: MouseEvent): void;
  onStopDragging?(): void;
}

export function useDrag(configuration: DragConfiguration) {
  const isDragging = ref(false);

  function startDragging(event: MouseEvent) {
    if(configuration.enableDrag !== undefined && configuration.enableDrag(event) === false) {
      return
    }

    if(event.which !== 1) {
      return
    }

    isDragging.value = true;
    configuration.onStartDragging?.(event);
    event.preventDefault();

    window.addEventListener('mousemove', dragging);
    window.addEventListener('mouseup', stopDragging);
  }

  function dragging(event: MouseEvent) {
    if(isDragging.value) {
      configuration.onDragging?.(event);
    }
  }

  function stopDragging() {
    isDragging.value = false;
    configuration.onStopDragging?.();

    window.removeEventListener('mousemove', dragging);
    window.removeEventListener('mouseup', stopDragging);
  }



  onMounted(() => {
    configuration.element.value?.addEventListener('mousedown', startDragging);
  });
  onUnmounted(() => {
    configuration.element.value?.removeEventListener('mousedown', startDragging);
  });

  return { isDragging }
}