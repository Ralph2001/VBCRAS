<template>
  <button
    class="hover:border-blue-600 border-2 duration-300 shadow-md text-sm flex flex-col font-medium text-wrap tracking-wider p-4 rounded bg-[#F0F0F0] h-[10rem] text-gray-900 hover:bg-gray-200 justify-evenly"
  >
    {{ label }}
    <p class="text-gray-500 font-normal font-mono">Return Home</p>
  </button>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
  },
});
</script>

<style lang="scss" scoped></style>
