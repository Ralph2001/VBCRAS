<template>
    <div>
        <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>
        <input type="text" id="first_name"
            class="bg-gray-50 uppercase border focus:bg-blue-50 border-gray-300 font-bold text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required />
    </div>
</template>

<script setup>
const props = defineProps({
    label: String
})
</script>

<style lang="scss" scoped></style> 