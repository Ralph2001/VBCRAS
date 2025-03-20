<template>
    <div class="w-full">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>
        <select @change="emit('update:modelValue', $event.target.value)"
            :class="{ 'border-red-400': error, 'border-gray-300': !error }"
            class=" border  text-gray-900 text-sm rounded-md font-bold focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected disabled></option>
            <option class="font-medium text-sm" v-for="option in optionData" :key="option" :value="option" :selected="option === modelValue">{{
            option }}
            </option>
        </select>
    </div>
</template>

<script setup>
const emit = defineEmits(['update:modelValue'])


const props = defineProps({
    label: String,
    optionData: {
        type: Array,
        required: true
    },
    modelValue: {
        required: true
    },
    error: {
        type: Boolean,
        default: false
    },


})
</script>
