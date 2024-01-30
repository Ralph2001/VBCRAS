<template>
  <div
    :class="{ hidden: !isDropzoneVisible }"
    class="flex flex-col justify-center fixed top-0 bottom-0 left-0 right-0 rounded-sm border-2 border-blue-500 border-dashed items-center opacity-40 bg-blue-50 cursor-grabbing transition-all z-50"
  >
    <p
      class="text-2xl font-bold text-gray-500 opacity-100 text-center uppercase cursor-none select-none disabled"
    >
      Drop PDF FIle Here
    </p>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  isDropzoneVisible: {
    type: Boolean,
    required: true,
  },
});
</script>
