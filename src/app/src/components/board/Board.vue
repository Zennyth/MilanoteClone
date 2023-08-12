<template>
	<div class="board grid" ref="board" @mousemove="mousemove" @mouseup="mouseup" @click.right="rightClick">
		<BoardComponent v-for="(component, index) in components" :key="component.id" v-model="components[index]"
			:is-dragging="interaction.isDragging" @component-mousedown="componentMousedown">
		</BoardComponent>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, Ref, nextTick } from 'vue'

import BoardComponent from '@/components/board/BoardComponent.vue'
import { useBoardStore } from '@/store/modules/boardStore'
import { BoardComponentData, Shape, Vector2, createDefaultComponent } from './types'
import { storeToRefs } from 'pinia'
import { isIn } from '@/utils/grid'
import { useDrag } from '@/composables/drag'

const board = ref<HTMLDivElement>()
const emit = defineEmits(['ready'])

const boardStore = useBoardStore()
const { interaction, openBoard } = boardStore
const { components, zoom } = storeToRefs(boardStore)


import { useRoute } from 'vue-router'

const route = useRoute()
const boardId: string | string[] = route.params.id


function rightClick(event: MouseEvent) {
	event.preventDefault()

	boardStore.addComponent(createDefaultComponent('ImageBoard', event.pageY, event.pageX))
	// src: 'https://i.pinimg.com/564x/c5/ba/1a/c5ba1ad1bc19880c8f756ed73c9b89d3.jpg'
}

onMounted(() => {
	if(Array.isArray(boardId)) {
		return
	}

	openBoard(board.value, boardId)
	setTimeout(() => ready(), 100)
})

function ready() {
	emit('ready')

	nextTick(boardStore.scaleZoomToFit)
}


// handle multiple selection
const startMultipleSelectionPosition: Ref<Vector2> = ref({ x: 0, y: 0 })
const endMultipleSelectionPosition: Ref<Vector2> = ref({ x: 0, y: 0 })

useDrag({
	element: board,
	onStartDragging: (event: MouseEvent) => {
		startMultipleSelectionPosition.value = { x: event.clientX, y: event.clientY }
	},
	onStopDragging: (event: MouseEvent) => {
		endMultipleSelectionPosition.value = { x: event.clientX, y: event.clientY }

		const selectionShape: Shape = {
			position: startMultipleSelectionPosition.value,
			size: { x: endMultipleSelectionPosition.value.x - startMultipleSelectionPosition.value.x, y: endMultipleSelectionPosition.value.y - startMultipleSelectionPosition.value.y },
			rotation: 0
		}

		const selectedComponents: Array<BoardComponentData> = components.value.filter(c => isIn(selectionShape, c))
		console.warn(selectedComponents)
	}
})


// handle component movements
const componentMousedown = (event: MouseEvent, component: BoardComponentData) => {
	if (event.which !== 1) {
		return
	}

	interaction.hasMoved = false
	interaction.target = component
	interaction.isEvent = true
	event.preventDefault()
	event.stopPropagation()


	interaction.timeout = setTimeout(() => {
		if (component.isDraggable === false) {
			return
		}

		interaction.isDragging = true
		component.isDragged = true
		interaction.offset.x = (event.clientX / zoom.value) - component.position.x
		interaction.offset.y =(event.clientY / zoom.value) - component.position.y
		interaction.timeout = undefined
	}, 100)
}
const mousemove = (event: MouseEvent) => {
	if (!interaction.isDragging || interaction.target === undefined) return

	interaction.target!.position.x = (event.clientX / zoom.value) - interaction.offset.x
	interaction.target!.position.y = (event.clientY / zoom.value) - interaction.offset.y
	interaction.hasMoved = true
	boardStore.interaction.onDragging.fire(interaction.target)
}
const mouseup = (event: MouseEvent) => {
	interaction.isDragging = false

	if (interaction.target !== undefined && interaction.target.id !== undefined) {
		interaction.target.isDragged = false
		interaction.target.position = boardStore.snapVector2(interaction.target.position)
		boardStore.interaction.onDropped.fire(interaction.target)
	}

	if (!interaction.isEvent) {
		if (interaction.target !== undefined) {
			interaction.target.isSelected = false
		}
		interaction.hasMoved = false
		return
	}

	interaction.isEvent = false
	clearTimeout(interaction.timeout)
	event.preventDefault()

	if (!interaction.hasMoved) {
		interaction.isSelected = true
		interaction.target!.isSelected = true
		return
	}
	interaction.target = undefined
}


watch(() => zoom.value, () => {
	if (zoom.value < 1) {
		board.value?.classList.remove('grid');
	} else {
		board.value?.classList.add('grid');
	}
});
</script>

<style lang="scss"></style>
