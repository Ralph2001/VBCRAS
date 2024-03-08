<template>

        <div :class="{ 'border-red-400 ': error }"
            class="flex basis-[7rem]  items-center p-2 px-2 h-[3.5rem]  rounded-lg dark:border-gray-700 cursor-pointer typebox border border-gray-200 transition-all">
            <fwb-radio :label="label" :value="value" :checked="isChecked" name="typeBox"
                @input="emit('update:modelValue', $event.target.value)" class="cursor-pointer" />

        </div>
 
</template>

<script setup>
import { FwbRadio } from 'flowbite-vue';

import { computed } from 'vue';
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    modelValue: {
        type: String,
        default: '',
    },
    error: {
        type: Boolean,
        default: false
    }
});

const isChecked = computed(() => props.value === props.modelValue);
</script>

<style>
.typebox:hover {
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}
</style>