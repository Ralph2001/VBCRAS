<template>
  <div>
    <p class="text-md font-bold p-1 px-2 border-none w-auto text-center  rounded " :class="class">{{ title }}</p>
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

