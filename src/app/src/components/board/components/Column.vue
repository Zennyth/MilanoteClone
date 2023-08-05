<template>
	<div class="component-container">
		<Card class="column" @mousedown="mousedown">
			<template #title>
				<h3>Column Title</h3>
			</template>
			<template #subtitle>
				<p>{{ childNumber }} items</p>
			</template>
			<template #content>
				<div class="column-children-container" :class="{ selected: previewPlaceholder }">
					<BoardComponent 
						v-for="(child, index) in component.children" 
						:key="child.id"
						v-model="component.children[index]"
						@component-mousedown="childMousedown"
					/>
					
				</div>
			</template>
		</Card>
		<Resize v-model="component" />
	</div>
</template>
  
<script lang="ts" setup>
import Resize from '../options/Resize.vue';
import BoardComponent from '@/components/board/BoardComponent.vue'
import { computed, onMounted , Ref } from 'vue'
import { BoardComponentData } from '../types';
import { useBoardStore } from '@/store/modules/boardStore';
import { storeToRefs } from 'pinia';
import { rectanglesIntersect } from '@/utils/grid';
import { getYjsValue } from '@syncedstore/core'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'mousedown'])

const component: Ref<BoardComponentData> = computed({
	get() {
		return props.modelValue
	},
	set(value) {
		emit('update:modelValue', value)
	}
})

const childNumber: Ref<number> = computed(() => component.value.children?.length ?? 0);

const boardStore = useBoardStore();
const { draggedComponent, components } = storeToRefs(boardStore);
const previewPlaceholder: Ref<boolean> = computed(() => draggedComponent.value !== undefined && rectanglesIntersect(draggedComponent.value, component.value))

onMounted(() => {
	component.value.children ??= [];
})

boardStore.interaction.onDropped.subscribe((target?: BoardComponentData) => {
	if (target === undefined || !rectanglesIntersect(target, component.value) || target === component.value)
		return

	const copy: BoardComponentData = getYjsValue(target)?.toJSON()
	copy.isInContainer = true  
	boardStore.removeComponent(target)
	component.value.children.push(copy)
})


const mousedown = (event: MouseEvent) => {
	emit('mousedown', event, component.value);
}

const childMousedown = (event: MouseEvent, target: BoardComponentData) => {
	event.stopPropagation();

	const copy: BoardComponentData = getYjsValue(target)?.toJSON()
	copy.isInContainer = false
	component.value.children.splice(component.value.children.indexOf(target), 1)
	boardStore.addComponent(copy)
	
	emit('mousedown', event, components.value.find((c) => c.id === copy.id));
}

</script>

<style lang="scss">
.column {
	.p-card {
		&-body {
			height: 100%;
		}
	}

	&-children-container {
		min-height: 7rem;
		background-color: var(--surface-b);

		&.selected {
			outline: 1px solid var(--text-color);
			outline-offset: -1px;
		}
	}
}
</style>