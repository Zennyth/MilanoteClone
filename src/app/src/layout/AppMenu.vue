<template>
	<ul class="layout-menu">
		<template v-for="(item, i) in model" :key="item">
			<app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
			<li v-if="item.separator" class="menu-separator"></li>
		</template>
	</ul>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useBoardStore } from '@/store/modules/boardStore'
import { boardPlugin } from '@/plugins/board'
import { createDefaultComponent } from '@/components/board/types'

const { addComponent } = useBoardStore();

import AppMenuItem from './AppMenuItem.vue'

const model = ref([
		{
		// label: 'Components',
		separator: undefined,
		
		items: [
			{ icon: '', command: () => { } },
		]
	},
])

onMounted(() => {
	model.value[0].items = boardPlugin.components.map(r => ({
		icon: r.icon,
		command: () => addComponent(createDefaultComponent(r.name, 50, 50))
	}))
})
</script>

<style lang="scss" scoped></style>
