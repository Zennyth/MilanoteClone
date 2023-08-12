<template>
	<div class="layout-topbar">
		<div class="layout-topbar-top header">
			<div class="header-left">
				<Breadcrumb :home="home" :model="items" />
			</div>
			<div class="header-right" v-if="me !== undefined">
				<Avatar :image="me.img" shape="circle" />
				<AvatarGroup>
					<Avatar v-for="user in othersToDisplay" :key="user.id" :image="user.img" shape="circle" />
					<Avatar v-if="numberOfUsersToHide > 0" :label="`+${numberOfUsersToHide}`" shape="circle" :style="{ 'background-color': '#f8f9fa', color: '#495057' }" />
				</AvatarGroup>
			</div>
		</div>
		<div class="layout-topbar-bottom header">
			<div class="header-left">
			</div>
			<div class="header-middle">
				<h3>Art References</h3>
			</div>
			<div class="header-right">
				<Button plain text label="Share" class="mr-2" />
				<Button plain text iconPos="right" icon="pi pi-angle-down" label="Export"  />
				<ZoomButton />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import ZoomButton from './components/ZoomButton.vue'

import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useBoardStore } from '@/store/modules/boardStore'

const boardStore = useBoardStore();
const { me, othersToDisplay, numberOfUsersToHide } = storeToRefs(boardStore);


const home = ref({
	icon: 'pi pi-home',
	to: '/'
})
const items = ref([
	{ label: 'Game' },
	{ label: 'Art References' }
])
</script>

<style lang="scss" scoped></style>
