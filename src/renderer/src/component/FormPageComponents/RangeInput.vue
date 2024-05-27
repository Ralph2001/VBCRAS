<template>
    <div class="w-full">
        <label for="default-range" :value="modelValue"
            class="block mb-1 text-sm font-medium text-gray-900 dark:text-white">{{ label
            }}</label>
        <div class="w-full flex items-center gap-1 flex-row">
            <input type="range" min="0" :max="max" step="0.1" @input="emit('update:modelValue', $event.target.value)"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
            <div class="basis-[2rem] flex items-center justify-center">{{ modelValue }}</div>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
    label: String,
    modelValue: {
        required: false,
        type: [String, Number, Boolean],
        default: "",
    },
    max: Number,

})
</script>

<style lang="scss" scoped></style>