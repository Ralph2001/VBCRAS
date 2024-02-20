<template>
  <div>
    <p class="text-md font-bold p-1 px-2 w-auto text-center text-gray-900  rounded border-none" :class="class">{{ title
    }}</p>
  </div>
</template>

<script setup>

import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  }
})


</script>

