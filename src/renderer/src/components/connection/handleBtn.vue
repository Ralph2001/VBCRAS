<template>
    <button :type="type" :class="addClass"
        class="py-2 px-4 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none rounded-sm border border-gray-200 hover:bg-gray-300 focus:z-10   dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
        {{ label }}
    </button>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    addClass: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'button'
    }
})
</script>

