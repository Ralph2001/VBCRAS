<template>
    <button type="button"
        class="mode text-sm font-semibold uppercase antialiased text-gray-800 button-10 w-[6rem] h-[5rem] border border-gray-300 rounded-lg bg-gray-100">
        {{ title }}
    </button>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
})
</script>

<style>
.mode {
    transition: all 0.1s ease-in-out;
    transition-duration: .1s;
}

.mode:hover {
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

.mode:active {
    scale: 0.9;
}
</style>
