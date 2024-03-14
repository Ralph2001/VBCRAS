<template>

    <div class="flex flex-row gap-1">
        <div :class="{ 'border-red-400 ': error }" v-for="option in options"
            class="flex w-[7.5rem] items-center p-2 px-2 h-[3.5rem]  rounded-lg dark:border-gray-700 cursor-pointer typebox border border-gray-200 transition-all">
            <fwb-radio :label="option" :value="option" checked name="typeBox"
                @click="emit('update:modelValue', $event.target.value)" class="cursor-pointer" />

        </div>
    </div>


</template>

<script setup>
import { FwbRadio } from 'flowbite-vue';

import { computed } from 'vue';
const emit = defineEmits(['update:modelValue']);



const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    error: {
        type: Boolean,
        default: false
    },
    options: {
        type: Array,
        default: true
    },
    ischeck: String
});

const isChecked = computed(() => props.value === props.modelValue);
</script>

<style>
.typebox:hover {
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}
</style>