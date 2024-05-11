<template>
  <v-container v-if="props.model.map.size > 0">
    <p v-html="formattedText"></p>
  </v-container>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import type { Model } from '@/types/model';

const props = defineProps<{
  model: Model;
}>();
const gaptext = defineModel<string>();

watch(
  () => props.model,
  (model) => {
    let text = model.text;
    for (const [_, value] of model.map) {
      if (model.selected.includes(value.key)) {
        value.sublist.forEach((v) => {
          const regex = new RegExp(`\\b${v}\\b`, 'gi');
          text = text.replaceAll(regex, '____________');
        });
      }
    }
    gaptext.value = text;
  }
);

const formattedText = computed(() => {
  // Replace line breaks with <br> tags to preserve formatting
  return gaptext.value.replace(/\n/g, '<br>');
});
</script>
