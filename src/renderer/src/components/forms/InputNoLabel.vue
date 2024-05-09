<template>
    <input :class="`w-[${width}]`" type="text"
        class="bg-white border  items-center text-center font-semibold border-gray-200 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500   px-2 py-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
</template>

<script setup>
const props = defineProps({
    width: String,
})
</script>

<style lang="scss" scoped></style>