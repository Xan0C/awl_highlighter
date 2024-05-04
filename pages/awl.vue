<script setup>
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://brxcicbmibmpegoeiabq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyeGNpY2JtaWJtcGVnb2VpYWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ4MjUyOTUsImV4cCI6MjAzMDQwMTI5NX0.EDFYcQ0fiEKN3oBzTxbLYWfyT_xYR8anorZe-orUHJU')
const countries = ref([])

async function getCountries() {
  const { data } = await supabase.from('awl').select()
  countries.value = data
}

onMounted(() => {
  getCountries()
})
</script>

<template>
  <ul>
    <li v-for="country in countries" :key="country.headword">{{ country.related_word_forms }}</li>
  </ul>
</template>