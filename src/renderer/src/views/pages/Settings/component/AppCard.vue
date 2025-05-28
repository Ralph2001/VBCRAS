<template>
    <div
        class="h-28 rounded-xl bg-white p-4 flex flex-col items-center justify-center w-full border border-gray-200 hover:shadow-md transition duration-300 cursor-pointer">
        <i :class="'lucide ' + icon + ' text-[#695CFD] mb-2'"></i>
        <p class="text-gray-800 font-semibold text-sm uppercase text-center">{{ title }}</p>
        <p class="text-xs text-gray-500 text-center mt-1">{{ desc }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    icon: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    }
});
</script>