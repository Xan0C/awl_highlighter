<template>
  <v-textarea v-model="text" clearable variant="solo-filled"></v-textarea>
  <v-list lines="lines" v-if="model.map.size > 0">
    <v-list-item v-for="value in sortedList" :key="value.key">
      <div class="wordlist">
        <v-checkbox-btn v-model="selected" :label="value.key + ''" :value="value.key" />
        <span>{{ [...value.sublist].join(', ') }}</span>
      </div>
    </v-list-item>
  </v-list>
</template>

<style scoped>
.wordlist {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
}
</style>

<script setup lang="ts">
import { Gapword, Model } from '@/types/model';
import { defineModel, inject, ref, watch, computed } from 'vue';
import type { WordlistData } from '@/types/wordlist';
import type { Ref, UnwrapRef } from '@vue/reactivity';

const text = ref('');
const selected = ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
const wordlist = inject<Ref<UnwrapRef<WordlistData[]>>>('wordlist');

const model = defineModel<Model>();

function addAwlWordToModel(found: WordlistData, word: string) {
  const list = model.value.map.get(found.sublist);
  if (list) {
    list.sublist.add(word);
    list.headwords.add(found.headword);
  } else {
    model.value.map.set(found.sublist, {
      key: found.sublist,
      sublist: new Set([word]),
      headwords: new Set([found.headword]),
      related_word_forms: found.related_word_forms
    });
  }
}

watch(text, (text) => {
  const words = text.split(/\W+/);
  const list = wordlist.value;
  model.value.map.clear();

  for (const word of words) {
    const found = list.find((awl) => {
      return (
        awl.headword === word.toLowerCase() || awl.related_word_forms?.includes(word.toLowerCase())
      );
    });
    if (found) {
      addAwlWordToModel(found, word.toLowerCase());
    }
  }

  model.value = {
    text: text,
    map: model.value.map,
    selected: selected
  };
});

watch(selected, (selected) => {
  model.value = {
    text: text,
    map: model.value.map,
    selected: selected
  };
});

const sortedList = computed(() => {
  return Array.from(model.value?.map.values()).sort(
    (a: Gapword, b: Gapword) => a.key > b.key
  ) as Gapword[];
});
</script>
