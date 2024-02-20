<template>
    <div>
        <label :for="label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>
        <input :value="modelValue" :type="type" :id="label" @change="emit('update:modelValue', $event.target.value)"
            :class="{ 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500': error }"
            class="bg-gray-50 font-bold border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required>


        <p v-if="error" class="text-md text-red-500 font-semibold">Required Field</p>


    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    modelValue: {
        type: String
    },
    error: {
        type: Boolean
    }
})
</script>

