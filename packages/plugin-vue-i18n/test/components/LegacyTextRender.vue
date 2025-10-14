<script setup lang="ts">
import { nextTick, ref } from 'vue';

const { text } = defineProps<{
  text?: () => string | undefined;
}>();
const value = ref();
const result = text?.() ?? '';
if (typeof result?.then === 'function') {
  result.then((v) => {
    value.value = v ?? '';
  });
} else {
  value.value = result ?? '';
}
//nextTick(() => {
//  value.value = text?.() ?? '';
//});
</script>

<template>
  {{ value }}
</template>
