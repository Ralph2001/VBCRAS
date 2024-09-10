<template>
    <input id="default-checkbox" type="checkbox" :checked="modelValue"
        @change="emit('update:modelValue', $event.target.checked)"
        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
    <label for="default-checkbox" class="ms-2 text-sm font-base  text-gray-900 dark:text-gray-300">{{ label }}</label>
</template>

<script setup>
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
    label: String,
    modelValue: Boolean
});
</script>

<style lang="scss" scoped></style>
