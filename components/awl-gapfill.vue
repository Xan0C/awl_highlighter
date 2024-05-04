<template>
  <v-container v-if="value && value.map && value.map.size > 0">
    <v-container>
      <v-btn-toggle
          color="blue"
          group
          mandatory
          v-model="toggle"
      >
        <v-btn value="simple">
          simple gapfill
        </v-btn>

        <v-btn value="headword">
          head word gapfill
        </v-btn>

        <v-btn value="wordfamily">
          word family gapfill
        </v-btn>
      </v-btn-toggle>
    </v-container>
    <p v-html="formattedText"></p>
  </v-container>
</template>

<style scoped>

</style>

<script setup>
  const toggle = defineModel({
    default: 'simple'
  })
  const props = defineProps({
    value: {
      type: Object,
    }
  });
  const gaptext = ref('');

  watch(() => props.value, (prop) => {
    gaptext.value = prop.text;
    for (const [_, value] of prop.map) {
      if (prop.selected.includes(value.key)) {
        value.sublist.forEach(v => {
          gaptext.value = gaptext.value.replaceAll(v, '_____');
        });
      }
    }
  });

  watch(toggle, (toggle) => {
    console.log(toggle);
  })

  const formattedText = computed(() => {
    // Replace line breaks with <br> tags to preserve formatting
    return gaptext.value.replace(/\n/g, "<br>");
  });
</script>