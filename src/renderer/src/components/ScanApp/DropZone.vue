<template>
  <div
    :class="{ hidden: !isDropzoneVisible }"
    class="flex flex-col justify-center absolute w-[100%] h-full rounded-sm border-4 border-blue-500 border-dashed items-center bg-white cursor-grabbing transition-all z-40"
  >
    <p
      class="text-4xl font-bold text-gray-400 text-center uppercase opacity-50 cursor-none select-none"
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
