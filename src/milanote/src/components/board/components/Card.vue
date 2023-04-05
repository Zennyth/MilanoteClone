<template>
  <Card>
    <template #title> hello </template>
    <template #content>
      <p>
        paragraph
      </p>
    </template>
  </Card>
</template>

<script setup>
const props = defineProps(['component']);
</script>
