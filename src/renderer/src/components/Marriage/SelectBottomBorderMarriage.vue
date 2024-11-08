<template>
    <div class="flex flex-col items-center relative" :class="[`w-[${props.width}] bg-none`]">
        <!-- Error message for the input field -->
        <label v-if="props.error" class="absolute text-sm italic text-red-500 -right-0 -top-2">*</label>

        <!-- Top label for the select field -->
        <label v-if="props.label && props.top_label" class="text-[10px] font-medium text-zinc-800">
            ({{ props.label }})
        </label>

        <!-- Select input field -->
        <select :value="modelValue" :disabled="props.disabled" :tabindex="props.skip ? -1 : 1" :id="props.label"
            @change="emitValue" :class="[
                props.error ? 'bg-red-100' : props.modelValue ? 'bg-yellow-50' : 'bg-blue-50',
                props.middle ? 'text-center' : 'text-start',
                props.page_2 ? 'text-md font-normal' : 'text-xs font-bold',
                'border-t-0 border-l-0 w-full  disabled:bg-blue-50 disabled:cursor-not-allowed focus:bg-blue-200 border-e-0 border-b-0 py-0 tracking-wide border-gray-400 outline-none focus:ring-0 ring-0'
            ]">
            <!-- Render options dynamically from props.options array -->
            <option class="font-medium bg-white" v-for="(option, index) in props.options" :key="index"
                :value="option.value" :disabled="option.disabled">
                {{ option.label }}
            </option>
        </select>

        <!-- Bottom label for the select field -->
        <label v-if="props.label && !props.top_label" class="text-xs italic text-zinc-400">
            ({{ props.label }})
        </label>
    </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
    label: String,
    options: {
        type: Array,
        required: true,
        default: () => [] // array of options should be passed as props
    },
    modelValue: String,
    type: {
        type: String,
        default: "text"
    },
    width: {
        type: String,
        default: "100%"
    },
    skip: {
        type: Boolean,
        default: false
    },
    isBold: {
        type: Boolean,
        default: false
    },
    error: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    top_label: {
        type: Boolean,
        default: false
    },
    middle: {
        type: Boolean,
        default: false
    },
    page_2: {
        type: Boolean,
        default: false
    }
});

// Emit updated value for the select input
const emitValue = (e) => {
    const selectedValue = e.target.value;
    if (props.isBold) {
        emit('update:modelValue', selectedValue.toUpperCase());
        return;
    }
    emit('update:modelValue', selectedValue);
}
</script>

<style scoped>
/* Additional custom styles can go here */
</style>