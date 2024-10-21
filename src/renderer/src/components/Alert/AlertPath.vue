<template>
    <div
        class="fixed top-10 right-10 h-auto w-[24rem] p-4 bg-red-400 flex flex-col gap-2 rounded-md z-[99999999999999] shadow-sm">
        <p class="font-medium text-2xl text-white">{{ title }}</p>

        <p class="text-sm text-white">{{ body }}</p>
    </div>
</template>
<script setup>
const props = defineProps({
    title: String,
    body: String
})
</script>