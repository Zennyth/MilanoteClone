<template>
	<Button plain text iconPos="right" icon="pi pi-angle-down" :label="zoomPercentage" @click="toggle" />

	<OverlayPanel ref="overlayPanel">
		<h5>Zoom</h5>
		<span>Tip: hold ctrl and use mouse wheel to zoom.</span>
		<Slider v-model="zoomModel" :min=".3" :max="3" :step=".05" class="mt-3" />
		<Button plain text class="mt-3 full-size" @click="boardStore.scaleZoomToFit">
			<span>Scale to fit</span>
		</Button>
	</OverlayPanel>
</template>

<script lang="ts" setup>
import { ref, computed, Ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useBoardStore } from '@/store/modules/boardStore'

const boardStore = useBoardStore();
const { zoom } = storeToRefs(boardStore);

const zoomPercentage: Ref<string> = computed(() => `${Math.round(zoom.value * 100)}%`)

const zoomModel: Ref<number> = computed({
	get() {
		return zoom.value
	},
	set(value) {
		boardStore.setZoom(value)
	}
})


const overlayPanel = ref()

function toggle(event: MouseEvent) {
	overlayPanel.value.toggle(event);
}

// function reset() {

// }
</script>

<style lang="scss">
.full-size {
	width: 100%;

	>span {
		width: 100%;
	}
}
</style>