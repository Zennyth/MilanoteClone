<template>
  <div class="component-container">
    <img :src="'https://i.pinimg.com/564x/c5/ba/1a/c5ba1ad1bc19880c8f756ed73c9b89d3.jpg'" draggable="false" />
    <Resize v-model="component" />
  </div>
</template>
    
<script lang="ts" setup>
import Resize from '../options/Resize.vue';
import { computed, Ref } from 'vue'
import { BoardComponentData } from '../types';

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const component: Ref<BoardComponentData> = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>