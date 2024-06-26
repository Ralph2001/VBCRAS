<template>
    <button type="button"
        class="mode flex flex-col items-center justify-center gap-1 uppercase text-sm font-semibold  antialiased text-gray-800  button-10 w-[6rem] h-[5rem] border border-gray-300 rounded-lg bg-white hover:bg-gray-100  hover:shadow-sm tracking-wide">
        <font-awesome-icon icon="fa-regular fa-user" />
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
