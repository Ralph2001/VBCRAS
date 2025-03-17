<template>
    <input :tabindex="skip ? '-1' : ''" type="text" :value="modelValue" @input="value_toUpperCase($event.target)"
        :class="[
            baseClasses,
            {
                'text-center': middle,
                'border-0 ring-0 focus:outline-none focus:ring-0': unbordered,
                'border border-gray-300 focus:ring-blue-500 focus:border-blue-500': !unbordered,
                italic: italic,
                'font-bold': bold,
                'bg-transparent': isTransparent,
                'focus:ring-red-400 focus:border-red-400': she,
                'border-red-500 ring-0 focus:ring-red-500 focus:border-red-500': error,
                'cursor-help': isReadOnly
            }
        ]" :readonly="isReadOnly" />
</template>

<script setup>
import { computed, nextTick } from 'vue';

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
    width: {
        type: String,
        default: 'auto'
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
    isTransparent: {
        type: Boolean,
        default: false
    },
    she: {
        type: Boolean,
        default: false
    },
    modelValue: {
        type: [String, Number, Boolean],
        default: ""
    },
    error: {
        type: Boolean,
        default: false
    },
    isReadOnly: {
        type: Boolean,
        default: false
    },
    skip: {
        type: Boolean,
        default: false
    },
    // New prop: when true, the value will be forced to uppercase
    isUpperCase: {
        type: Boolean,
        default: false
    }
});

const baseClasses = computed(() => [
    `w-[${props.width}]`,
    !props.bold ? 'font-semibold' : '',
    !props.isTransparent ? 'bg-white' : '',
    !props.she ? 'focus:ring-blue-500 focus:border-blue-500' : '',
    'items-center text-gray-900 text-sm rounded px-2 py-1.5'
]);

// Computed property for v-model handling uppercase transformation if needed
const value_toUpperCase = (target) => {
    let value = target.value;

    if (props.isUpperCase) {
        value = value.toUpperCase();
    }

    // Save cursor position before update
    const start = target.selectionStart;
    const end = target.selectionEnd;

    emit('update:modelValue', value);

    // Restore cursor position after DOM update
    nextTick(() => {
        target.setSelectionRange(start, end);
    });
}
</script>

<style lang="scss" scoped>
/* Your scoped styles here */
</style>