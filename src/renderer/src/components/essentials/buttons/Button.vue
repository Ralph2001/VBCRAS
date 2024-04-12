<template>
    <button
        type="button"
        :class="{
            'bg-blue-500 text-white hover:bg-blue-600 shadow-lg transition-all':
                isActive,
            'text-gray-900 bg-white hover:bg-gray-100': !isActive,
        }"
        class="focus:outline-none font-semibold text-sm px-4 py-2 tracking-wide"
    >
        {{ label }}
    </button>
</template>

<script setup>
const props = defineProps({
    label: {
        type: String,
        default: '',
    },
    isActive: {
        type: Boolean,
        default: false,
    },
})
</script>

<style lang="scss" scoped></style>
