<script setup lang="ts">
const { text } = defineProps<{
  text?: () => string | undefined;
}>();
</script>

<template>
  {{ text() }}
</template>
