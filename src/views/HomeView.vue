<template>
  <main>
    <v-container v-if="wordlist.length > 0" class="container">
      <section class="child">
        <v-text-field clearable label="Headline" v-model="headline"></v-text-field>
        <v-text-field clearable label="Task" v-model="task"></v-text-field>
        <v-text-field clearable label="Time in minutes" v-model="time"></v-text-field>
        <awl-wordlist v-model="model" />
        <awl-gapfill v-model="gaptext" :model="model" />
      </section>
      <section class="child">
        <iframe width="100%" height="850px"></iframe>
        <v-btn @click="createMockPdf">Create PDF</v-btn>
      </section>
    </v-container>
    <v-container v-else class="spinner">
      <v-progress-circular indeterminate :size="128" :width="8"></v-progress-circular>
    </v-container>
  </main>
</template>

<style scoped>
.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.container {
  width: 100%;
  display: flex;
  gap: 8px;
}
.child {
  flex: 1;
}
</style>

<script setup lang="ts">
import { createClient } from '@supabase/supabase-js';
import { onMounted, provide, ref } from 'vue';
import type { WordlistData } from '@/types/wordlist';
import type { Model } from '@/types/model';
import AwlWordlist from '@/components/awl-wordlist.vue';
import AwlGapfill from '@/components/awl-gapfill.vue';
import { createPdf } from '@/utils/create-pdf';

const supabase = createClient(
  'https://brxcicbmibmpegoeiabq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyeGNpY2JtaWJtcGVnb2VpYWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ4MjUyOTUsImV4cCI6MjAzMDQwMTI5NX0.EDFYcQ0fiEKN3oBzTxbLYWfyT_xYR8anorZe-orUHJU'
);

const model = ref<Model>({
  text: ref(''),
  selected: ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
  map: ref(new Map())
});
const gaptext = ref('');
const headline = ref('');
const task = ref('EN_L5_Q2 –');
const time = ref('20');

const wordlist = ref<WordlistData[]>([]);
provide('wordlist', wordlist);

const createMockPdf = () => {
  const selected = model.value.selected
    .map((key: number) => new Array(...(model.value.map.get(key)?.sublist ?? [])))
    .flat()
    .map((v: string) => v.toLowerCase());
  createPdf({
    gaptext: gaptext.value,
    type: 'text',
    headline: headline.value,
    solution: model.value.text,
    headwords: selected,
    task: task.value,
    time: time.value
  });
};

onMounted(async () => {
  const { data } = await supabase.from('awl').select();
  wordlist.value = data ?? [];
});
</script>
