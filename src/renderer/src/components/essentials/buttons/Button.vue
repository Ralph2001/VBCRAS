<template>
  <button type="button" :class="{
    'bg-blue-500 text-white hover:bg-blue-600 shadow-md transition-all': isActive,
    'text-gray-900 bg-white hover:bg-gray-100': !isActive,
  }"
    class="ml-auto text-white  overflow-hidden px-10 h-8  bg-blue-700 hover:bg-blue-800 focus:ring-0 active:scale-95 transition-all duration-200 focus:ring-blue-300 font-medium rounded-sm shadow text-sm  tracking-wider py-1.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
   <p class="truncate"> {{ label }}</p>
  </button>
</template>

<script setup>
import { useAttrs } from "vue";

const attrs = useAttrs();
const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped></style>
