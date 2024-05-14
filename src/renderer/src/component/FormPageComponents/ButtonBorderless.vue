<template>
    <button type="button" tabindex="-1"
        :class="{ 'bg-slate-600 text-white hover:bg-slate-700 shadow-2xl  ': isActive, 'hover:bg-gray-200 bg-white border-l border-r': !isActive }"
        class="w-full h-full p-1.5 text-center ">{{ label }}</button>
</template>

<script setup>
const props = defineProps({
    label: String,
    isActive: Boolean
})
</script>

<style lang="scss" scoped></style>