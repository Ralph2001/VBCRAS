<template>
  <div class="h-full flex justify-center items-center">
    <p :class="{
      'text-xs font-semibold py-1 px-1  w-32 text-center text-gray-900 rounded border-none shadow ': true,
      'bg-green-200': params.data.type === 'Birth',
      'bg-blue-200': params.data.type === 'Death',
      'bg-gray-200': params.data.type === 'Other',
      'bg-red-200': params.data.type === 'Marriage',
      'bg-yellow-100': params.data.type === 'Legal Instrument',

    }">
      {{ params.data.type }} </p>
  </div>
</template>

<script setup>

import { defineProps } from 'vue';

const props = defineProps({
  params: {
    type: Object,
    required: true
  }
})

</script>
<style>
.tagShadow {
  /* box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; */
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}
</style>