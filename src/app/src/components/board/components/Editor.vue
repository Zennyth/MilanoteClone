<template>
  <Editor v-model="component.text" editorStyle="height: 320px" :style="style">

  </Editor>
</template>
  
<script setup>
import { computed, watch, ref } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const component = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
});

const style = computed(() => ({
  position: 'absolute',
  top: component.value.top + 'px',
  left: component.value.left + 'px'
}))
</script>