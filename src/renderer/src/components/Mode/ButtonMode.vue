<template>
    <button type="button"
        class="mode flex flex-col gap-2 items-center  duration-100 justify-center  uppercase text-sm font-semibold  antialiased text-gray-800  button-10 w-auto h-auto p-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-100  hover:shadow-sm tracking-wide">
        <font-awesome-icon icon="fa-solid fa-network-wired" />
        <p class="text-sm font-medium "> {{ title }}</p>
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
