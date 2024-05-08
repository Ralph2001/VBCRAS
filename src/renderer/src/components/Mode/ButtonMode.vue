<template>
    <button type="button"
        class="mode text-sm font-semibold uppercase antialiased text-gray-800 button-10 w-[6rem] h-[5rem] border border-gray-300 rounded-lg bg-gray-100 hover:shadow-md tracking-wide">
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



.mode:active {
    scale: 0.9;
}
</style>
