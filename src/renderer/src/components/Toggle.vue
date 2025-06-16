<template>
    <label class="inline-flex items-center cursor-pointer select-none">
        <Switch v-model="localValue" @change="updateValue"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <span class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200"
                :class="localValue ? 'translate-x-5' : 'translate-x-1'" />
        </Switch>
        <span class="ml-3 text-sm font-medium text-gray-700">{{ label }}</span>
    </label>
</template>

<script setup>
import { computed } from 'vue';
import { Switch } from '@headlessui/vue';

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: '' }
});
const emit = defineEmits(['update:modelValue']);

// Create a local ref to tie into headlessui's v-model
const localValue = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val)
});

function updateValue(val) {
    emit('update:modelValue', val);
}
</script>

<style scoped>
/* Optional: add custom focus/active states if desired */
</style>
