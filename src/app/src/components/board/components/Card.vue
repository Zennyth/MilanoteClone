<template>
  <Card 
    :style="style" 
  >
    <template #title> {{ component.title }} </template>
    <template #content>
      <p>
        {{ component.paragraph }}
      </p>
    </template>
  </Card>
</template>

<script setup>
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

const style = computed(() => ({
  position: 'absolute',
  top: component.value.top + 'px',
  left: component.value.left + 'px'
}));
</script>