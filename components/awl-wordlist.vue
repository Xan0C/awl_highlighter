<template>
  <v-list lines="one" v-if="text">
      <v-list-item v-for="[key, value] in model.map">
        <div class="wordlist">
          <v-checkbox-btn v-model="selected" :label="key+''" :value="key" />
          <span>{{[...value.sublist].join(', ')}}</span>
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

<script setup>
import {useState} from "#app";
const wordlist = useState('wordlist');
const selected = defineModel({ default: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] });
const model = ref({
  selected: ref(selected),
  map: ref(new Map())
});

const props = defineProps({
  text: String,
})

const emits = defineEmits(['update:sublist']);

watch(() => props.text, (text) => {
  const words = text.split(/\W+/);
  const list = wordlist.value;
  model.value.map.clear();

  for (const word of words) {
    const found = list.find(awl => {
      return awl.headword === word.toLowerCase() || awl.related_word_forms?.includes(word.toLowerCase());
    });
    if (found) {
      const list = model.value.map.get(found.sublist);
      if (list) {
        list.sublist.add(word);
      } else {
        model.value.map.set(found.sublist, {
          key: found.sublist,
          sublist: new Set([word]),
          headword: found.headword,
          related_word_forms: found.related_word_forms
        });
      }
    }
  }

  emits('update:sublist', model)
});

watch(selected, () => {
  emits('update:sublist', model)
})
</script>
