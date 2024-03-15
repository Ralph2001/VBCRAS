<template>
    <input type="text" ref="input" :class="{ 'border-blue-600 border ring-2 ring-blue-400': hasValue != '' }"
        class=" placeholder:text-gray-300 placeholder:text-sm placeholder:font-normal pl-8 rounded-lg border border-gray-300 font-semibold w-full select-none"
        placeholder="Search" :value="modelValue" @change="emit('update:modelValue', $event.target.value)">
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { onKeyStroke } from '@vueuse/core';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
    modelValue: String,
    hasValue: String
});

const input = ref(null);

const isCtrlF = (event) => event.ctrlKey && (event.key === 'f' || event.key === 'F');

onKeyStroke(isCtrlF, (event) => {
    event.preventDefault();
    input.value.focus();
});
</script>

