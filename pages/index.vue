<template>
  <v-container v-if="wordList">
    <v-textarea v-model="text" clearable variant="solo-filled"></v-textarea>
    <awl-wordlist :text="text" @update:sublist="onSublistUpdate" />
    <awl-gapfill :value="gapfill" />
  </v-container>
</template>

<script setup>
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://brxcicbmibmpegoeiabq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyeGNpY2JtaWJtcGVnb2VpYWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ4MjUyOTUsImV4cCI6MjAzMDQwMTI5NX0.EDFYcQ0fiEKN3oBzTxbLYWfyT_xYR8anorZe-orUHJU')
const wordList = useState('wordlist');

await callOnce(async () => {
  const { data } = await supabase.from('awl').select()
  wordList.value = data || [];
})

const text = defineModel()
const gapfill = ref(null);
const onSublistUpdate = (data) => {
  gapfill.value = {
    text: text,
    map: data.value.map,
    selected: data.value.selected
  };
};
</script>
