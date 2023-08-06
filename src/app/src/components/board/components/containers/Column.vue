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
				<div class="column-children-container" :class="{ selected: previewPlaceholder }" ref="container">
					<PlaceholderIndicator :index="0" :ref="el => placeholders[0] = el" />

					<template v-for="(_, index) in component.children" :key="component.children[index].id">
						<BoardComponent v-model="component.children[index]" @component-mousedown="childMousedown" ref="children" />
						<PlaceholderIndicator :index="index" :ref="el => placeholders[index + 1] = el" />
					</template>
				</div>
			</template>
		</Card>
		<Resize v-model="component" />
	</div>
</template>
  
<script lang="ts" setup>
import Resize from '@board/options/Resize.vue'
import BoardComponent from '@board/BoardComponent.vue'
import PlaceholderIndicator from '@board/components/containers/PlaceholderIndicator.vue'

import { computed, onMounted, ref, Ref } from 'vue'
import { BoardComponentData, Vector2 } from '@/components/board/types'
import { useBoardStore } from '@/store/modules/boardStore'
import { storeToRefs } from 'pinia'
import { rectanglesIntersect } from '@/utils/grid'
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

const container = ref("container")
const childNumber: Ref<number> = computed(() => component.value.children?.length ?? 0);

const placeholders: Ref<any> = ref({})
const children: Ref<HTMLDivElement[]> = ref([])

const boardStore = useBoardStore();
const { draggedComponent, components } = storeToRefs(boardStore);
const previewPlaceholder: Ref<boolean> = computed(() => draggedComponent.value !== undefined && rectanglesIntersect(draggedComponent.value, component.value))

onMounted(() => {
	component.value.children ??= [];
})


boardStore.interaction.onDragging.subscribe((target?: BoardComponentData) => {
	if (!previewPlaceholder.value || target === undefined) {
		Object.values(placeholders.value).forEach((_: any, index: number) => {
			if (placeholders.value[index] !== null) {
				placeholders.value[index].isVisible = false
			}
		})

		return
	}

	console.log("hello")

	const targetCenter: Vector2 = { x: target.position.x + target.size.x / 2, y: target.position.y + target.size.y / 2 };
	const res = {
		distance: 9999999,
		target: 0
	}

	Object.values(placeholders.value).forEach((p: any, index: number) => {
		if (placeholders.value[index] !== null) {

			placeholders.value[index].isVisible = false

			const rect = p.root.getBoundingClientRect()
			const center: Vector2 = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }

			const distance = Math.sqrt(((center.x - targetCenter.x) ** 2) + ((center.y - targetCenter.y) ** 2))

			if (distance < res.distance) {
				res.distance = distance
				res.target = index
			}
		}	
	})

	placeholders.value[res.target].isVisible = true
})

boardStore.interaction.onDropped.subscribe((target?: BoardComponentData) => {
	if (target === undefined || !rectanglesIntersect(target, component.value) || target === component.value)
		return

	const copy: BoardComponentData = getYjsValue(target)?.toJSON()
	copy.isInContainer = true
	boardStore.removeComponent(target)

	const placeholder: any = Object.values(placeholders.value).find((p: any) => p.isVisible === true)
	component.value.children.splice(placeholder?.index ?? 0, 0, copy)
})


const mousedown = (event: MouseEvent) => {
	emit('mousedown', event, component.value);
}

const childMousedown = (event: MouseEvent, target: BoardComponentData) => {
	event.stopPropagation();

	const copy: BoardComponentData = getYjsValue(target)?.toJSON()
	copy.isInContainer = false

	const index = component.value.children.indexOf(target)
	component.value.children.splice(index, 1)
	console.log(index)
	delete placeholders.value[index + 1]
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
		// min-height: 7rem;
		// background-color: var(--surface-b);		

		// &.selected {
		// 	outline: 1px solid var(--text-color);
		// 	outline-offset: -1px;
		// }
	}
}
</style>