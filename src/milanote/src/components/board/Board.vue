<template>
  <div class="board"  v-on:click.right="addComponent">
    <component
      v-for="component in store.components"
      :is="component.type"
      :style="{position: 'absolute', top: component.top + 'px', left: component.left + 'px'}"
      :component="component"
      :key="component.id"
    >
      {{ component.text }}
    </component >
  </div>
</template>

<script setup>
import { store } from "@/services/syncedstore";

function addComponent(event) {
  event.preventDefault();

  store.components.push({
    id: Date.now(),
    type: "CardBoard",
    top: event.pageY,
    left: event.pageX,
    title: "Hello card",
    paragraph: "I'm a card",
  })
}
</script>