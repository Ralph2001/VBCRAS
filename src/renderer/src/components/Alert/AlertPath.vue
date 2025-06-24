<template>
    <div class="fixed top-6 right-6 w-[22rem] p-4 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-w-full">
        <p class="text-lg font-semibold text-gray-800">{{ title }}</p>
        <p class="text-sm text-gray-600 mt-1">{{ body }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    title: String,
    body: String
})
</script>
