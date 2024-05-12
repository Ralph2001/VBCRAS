<template>

    <input type="text" :value="modelValue" @input="emit('update:modelValue', $event.target.value)" :class="[
        baseClasses,
        {
            'text-center': middle,
            'border-0 ring-0 focus:outline-none focus:ring-0': unbordered,
            'border border-gray-300 focus:ring-blue-500 focus:border-blue-500': !unbordered,
            'italic': italic,
            'font-bold': bold,
            'bg-transparent': isTransparent,
            'focus:ring-red-400 focus:border-red-400': she,
            'border-red-500 ring-0 focus:ring-red-500 focus:border-red-500': error
        }
    ]" />
</template>

<script setup>
import { computed } from 'vue';
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
    width: {
        type: String,
        default: 'auto',
    },
    middle: Boolean,
    unbordered: {
        type: Boolean,
        default: false
    },
    italic: Boolean,
    bold: {
        type: Boolean,
        default: false
    },
    isTransparent: { type: Boolean, default: false },
    she: {
        type: Boolean,
        default: false
    },
    modelValue: {
        required: false,
        type: [String, Number, Boolean],
        default: "",
    },
    error: {
        type: Boolean,
        default: false
    },

});

const baseClasses = computed(() => [
    `w-[${props.width}]`,
    !props.bold ? 'font-semibold' : '',
    !props.isTransparent ? 'bg-white' : '',
    !props.she ? 'focus:ring-blue-500 focus:border-blue-500' : '',
    'items-center text-gray-900 text-sm rounded px-2 py-1.5'
]);
</script>

<style lang="scss" scoped></style>