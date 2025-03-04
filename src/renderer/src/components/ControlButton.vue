<template>
    <button
        class="rounded px-2.5 bg-gray-200 py-1 text-sm hover:bg-red-400 outline-none hover:text-white font-medium text-gray-700"
        @click="emits('action')">
        <font-awesome-icon :icon="icon" /> {{ buttonText }}
    </button>
</template>

<script setup>
import { defineProps } from 'vue';
const emits = defineEmits(['action']);
const props = defineProps({
    icon: {
        type: [String, Array],
        default: () => [],
        validator: (value) => {
            if (Array.isArray(value)) {
                return value.length === 2 && typeof value[1] === 'string'
            }
            return typeof value === 'string'
        }
    },
    buttonText: {
        type: String,
        default: 'Return'
    }
});

// Your component logic
</script>