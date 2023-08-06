<template>
	<div class="board grid" ref="board" @mousemove="mousemove" @mouseup="mouseup" @click.right="rightClick" :style="style">
		<BoardComponent v-for="(component, index) in components" :key="component.id" v-model="components[index]"
			:is-dragging="interaction.isDragging" @component-mousedown="mousedown">
		</BoardComponent>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch, Ref, StyleValue } from 'vue'

import BoardComponent from '@/components/board/BoardComponent.vue'
import { useBoardStore } from '@/store/modules/boardStore'
import { BoardComponentData, Shape, createDefaultComponent } from './types'
import { storeToRefs } from 'pinia'
import { getBoundingBox } from '@/utils/grid'

const board = ref<HTMLDivElement>()
const boardStore = useBoardStore()
const { interaction, openBoard } = boardStore
const { components, zoom } = storeToRefs(boardStore)


watch(() => components.value, () => {
	boundingBox.value = getBoundingBox(components.value);
}, { deep: true })
const boundingBox: Ref<Shape> = ref({ position: { x: 0, y: 0 }, size: { x: 0, y: 0 }, rotation: 0 });

function rightClick(event: MouseEvent) {
	event.preventDefault()

	boardStore.addComponent(createDefaultComponent('ImageBoard', event.pageY, event.pageX))
	// src: 'https://i.pinimg.com/564x/c5/ba/1a/c5ba1ad1bc19880c8f756ed73c9b89d3.jpg'
}

onMounted(() => {
	openBoard(board.value, '')
})

const mousedown = (event: MouseEvent, component: BoardComponentData) => {
	if (event.which !== 1) {
		return
	}

	interaction.hasMoved = false
	interaction.target = component
	interaction.isEvent = true
	event.preventDefault()

	
	interaction.timeout = setTimeout(() => {
		if (component.isDraggable === false) {
			return
		}
		
		interaction.isDragging = true
		component.isDragged = true
		interaction.offset.x = event.clientX - component.position.x
		interaction.offset.y = event.clientY - component.position.y
		interaction.timeout = undefined
	}, 100)
}

const mousemove = (event: MouseEvent) => {
	if (!interaction.isDragging || interaction.target === undefined) return

	interaction.target!.position.x = event.clientX - interaction.offset.x
	interaction.target!.position.y = event.clientY - interaction.offset.y
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

const style: Ref<StyleValue> = computed(() => ({
	with: boundingBox.value.size.x !== 0 ? `${boundingBox.value.size.x}px` : '',
	height: boundingBox.value.size.y !== 0 ? `${boundingBox.value.size.y}px` : ''
}))


watch(() => zoom.value, () => {
	if (zoom.value < 1) {
		board.value?.classList.remove('grid');
	} else {
		board.value?.classList.add('grid');
	}
});
</script>

<style lang="scss"></style>
