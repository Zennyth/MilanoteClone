<template>
	<div ref="root" class="container-placeholder-indicator" :class="{ visible: isVisible }"></div>
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue'

defineProps(['index'])
const isVisible: Ref<boolean> = ref(false)
const root: Ref<HTMLDivElement | undefined> = ref()

defineExpose({ isVisible, root });
</script>

<style lang="scss">
.container-placeholder-indicator {
	background-color: var(--surface-b);
	height: 2px;
	margin: .5rem 0;
	opacity: 0;

	&.visible {
		opacity: 1;
	}
}
</style>