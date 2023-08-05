<template>
  <div class="component-container">
    <Card>
      <template #title> {{ component.title }} </template>
      <template #content>
        <p>
          {{ component.paragraph }}
        </p>
      </template>
    </Card>
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