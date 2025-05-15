<!-- InfoRow.vue -->
<template>
    <div class="flex">
        <p class="w-[8rem] font-medium text-gray-800">{{ label }}</p>
        <p class="mx-1 font-semibold">:</p>
        <p class="flex-grow text-gray-900 ">{{ value }}</p>
    </div>
</template>

<script setup>
defineProps({
    label: String,
    value: String
})
</script>
