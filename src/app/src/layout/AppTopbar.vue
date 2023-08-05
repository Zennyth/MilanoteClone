<template>
	<div class="layout-topbar">
		<div class="layout-topbar-top header">
			<div class="header-left">
				<Breadcrumb :home="home" :model="items" />
			</div>
			<div class="header-right">
				<Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
				<AvatarGroup>
					<Avatar image="https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png" shape="circle" />
					<Avatar image="https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png" shape="circle" />
					<Avatar image="https://primefaces.org/cdn/primevue/images/avatar/ionibowcher.png" shape="circle" />
					<Avatar image="https://primefaces.org/cdn/primevue/images/avatar/xuxuefeng.png" shape="circle" />
					<Avatar label="+2" shape="circle" :style="{ 'background-color': '#f8f9fa', color: '#495057' }" />
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
				<Button plain text iconPos="right" icon="pi pi-angle-down" :label="`${Math.round(zoom * 100)}%`" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

import { useLayout } from '@/layout/composables/layout'
import { useRouter } from 'vue-router'
import { useBoardStore } from '@/store/modules/boardStore'

const { layoutConfig, onMenuToggle, contextPath } = useLayout()

const outsideClickListener = ref(null)
const topbarMenuActive = ref(false)
const router = useRouter()
const boardStore = useBoardStore();
const { zoom } = storeToRefs(boardStore);


const home = ref({
	icon: 'pi pi-home',
	to: '/'
})
const items = ref([
	{ label: 'Game' },
	{ label: 'Art References' }
])

onMounted(() => {
	bindOutsideClickListener()
})

onBeforeUnmount(() => {
	unbindOutsideClickListener()
})

const logoUrl = computed(() => {
	return `${contextPath}layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'
		}.svg`
})

const onTopBarMenuButton = () => {
	topbarMenuActive.value = !topbarMenuActive.value
}
const onSettingsClick = () => {
	topbarMenuActive.value = false
	router.push('/documentation')
}
const topbarMenuClasses = computed(() => {
	return {
		'layout-topbar-menu-mobile-active': topbarMenuActive.value
	}
})

const bindOutsideClickListener = () => {
	if (!outsideClickListener.value) {
		outsideClickListener.value = (event) => {
			if (isOutsideClicked(event)) {
				topbarMenuActive.value = false
			}
		}
		document.addEventListener('click', outsideClickListener.value)
	}
}
const unbindOutsideClickListener = () => {
	if (outsideClickListener.value) {
		document.removeEventListener('click', outsideClickListener)
		outsideClickListener.value = null
	}
}
const isOutsideClicked = (event) => {
	if (!topbarMenuActive.value) return

	const sidebarEl = document.querySelector('.layout-topbar-menu')
	const topbarEl = document.querySelector('.layout-topbar-menu-button')

	return !(
		sidebarEl.isSameNode(event.target) ||
		sidebarEl.contains(event.target) ||
		topbarEl.isSameNode(event.target) ||
		topbarEl.contains(event.target)
	)
}
</script>

<style lang="scss" scoped></style>
