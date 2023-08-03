<template>
  <div class="component-container">
    <img :src="component.src" draggable="false" />
    <Resize v-model="component" />
  </div>
</template>
    
<script setup>
import Resize from '../options/Resize.vue';
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const component = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>