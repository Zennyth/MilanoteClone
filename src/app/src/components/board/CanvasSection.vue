<template>
	<div class="canvas-section">
		<div ref="viewport" class="canvas-viewport" data-scrollable="true" @mousedown="mousedown">
			<div class="canvas-scroll-area" :style="canvasStyle">
				<Mouse v-for="user in others" :key="user.id" :position="user.mousePosition" :color="user.color" />
				<Board :style="boardStyle" @ready="resizeScrollableArea" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, computed, StyleValue } from 'vue';
import Board from './Board.vue';
import Mouse from './Mouse.vue'
import { useBoardStore } from '@/store/modules/boardStore';
import { getBoundingBox } from '@/utils/grid'
import { storeToRefs } from 'pinia';
import { Shape, Vector2 } from './types';

const viewport: Ref<HTMLDivElement | undefined> = ref();
const position = ref({
	top: 0, left: 0, x: 0, y: 0
});

const boardStore = useBoardStore();
const { components, zoom, others } = storeToRefs(boardStore); 

// handle grabbing
const mousedown = (event: MouseEvent) => {
	if (event.which !== 2) {
		return;
	}

	event.stopPropagation();

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

	viewport.value!.style.cursor = '';
	viewport.value!.style.removeProperty('user-select');
}

// handle zoom
const wheel = (event: WheelEvent) => {
	if (!event.ctrlKey)
		return

	event.preventDefault();
	boardStore.addZoom(- event.deltaY / 1000);
}
onMounted(() => {
	viewport.value?.addEventListener("wheel", wheel)
	boardStore.setViewport(viewport.value)
})

// handle canvas size by the components bounding box
const PADDING: number = 30
const boundingBox: Ref<Shape> = ref({ position: { x: 0, y: 0 }, size: { x: 0, y: 0 }, rotation: 0 });
const resizeScrollableArea = () => boundingBox.value = getBoundingBox(components.value);

boardStore.interaction.onDropped.subscribe(resizeScrollableArea)


// handle board
const boardSize: Ref<Vector2> = computed(() => ({
	x: (boundingBox.value.size.x + boundingBox.value.position.x + PADDING),
	y: (boundingBox.value.size.y + boundingBox.value.position.y + PADDING)
}))
const boardStyle: Ref<StyleValue> = computed(() => {
	if(viewport.value === undefined) {
		return {}
	}

	const rect = viewport.value?.getBoundingClientRect()

	return {
		width:  `${Math.max(rect.width / zoom.value, boardSize.value.x)}px`,
		height: `${Math.max(rect.height / zoom.value, boardSize.value.y)}px`
	}
})


// handle canvas
const canvasSize: Ref<Vector2> = computed(() => ({
	x: boardSize.value.x * zoom.value,
	y: boardSize.value.y * zoom.value
}))
const canvasStyle: Ref<StyleValue> = computed(() => ({
	width: boundingBox.value.position.x !== 0 ? `${canvasSize.value.x}px` : '',
	height: boundingBox.value.position.y !== 0 ? `${canvasSize.value.y}px` : ''
}))
</script>