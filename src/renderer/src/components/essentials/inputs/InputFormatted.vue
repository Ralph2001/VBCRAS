<template>
    <div>
        <label :for="label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>
        <input type="number" v-maska data-maska="####" :id="label" :value="modelValue"
            @input="emit('update:modelValue', $event.target.value)" :tabindex="tabindex" :readonly="readonly"
            data-inputmask="'mask': '9999 9999 9999 9999'"
            class=" relative items-center bg-gray-50 read-only:bg-gray-100 pl-[2.5rem] read-only:focus-within:bg-gray-100 read-only:focus-within:ring-gray-300 read-only:focus-within:border-gray-200  border   border-gray-300 font-bold focus:ring-green-500 focus:border-green-500 focus:bg-green-50 text-gray-900 text-sm 
            rounded-sm block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" />

        <p class="absolute top-[3.7rem] font-semibold text-sm left-6 text-gray-600 tracking-wider">CCE-</p>
        <p class="absolute top-[3.7rem] font-semibold text-sm left-[5.7rem] text-gray-600 tracking-wider">-2024</p>

    </div>
</template>

<script setup>
import { vMaska } from "maska"
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
    label: {
        type: String,
        default: '',
        required: false
    },
    modelValue: {
        required: false,
        type: [String, Number],
        default: ''
    },
    readonly: Boolean,
    tabindex: {
        type: [Number, String],
        default: 0
    }
})
</script>

<style lang="scss" scoped></style>