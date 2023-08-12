<template>
	<div v-if="position.x !== 0 && position.y !== 0" class="mouse" :style="style"></div>
</template>

<script lang="ts" setup>
import { Ref, StyleValue, computed } from 'vue';
import { Vector2 } from './types';

const props = defineProps(['position', 'color']);
const position: Ref<Vector2> = computed(() => props.position);

const style: Ref<StyleValue> = computed(() => ({
	left: `${position.value.x}px`,
	top: `${position.value.y}px`,
	'background-color': props.color
}))

</script>