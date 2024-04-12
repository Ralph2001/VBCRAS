<template>
    <div class="flex flex-row items-center p-3 px-5 mb-2">
        <p class="text-md font-semibold tracking-tight">
            {{ label }}
        </p>
        <div class="relative flex flex-row gap-1 ml-auto">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    label: {
        type: String,
        required: true,
    },
})
</script>

<style lang="scss" scoped></style>
