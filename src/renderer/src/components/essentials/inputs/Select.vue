<template>
    <div class="w-[10rem]">
        <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>
        <select id="countries" @change="emit('update:modelValue', $event.target.value)"
            class="bg-gray-50 border font-bold  border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected disabled> </option>
            <option v-for="option in options" :key="option" :value="option" :selected="modelValue === option">{{ option
                }}
            </option>
        </select>
    </div>
</template>

<script setup>
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    options: {
        type: [Object, Array],
        required: true
    },
    label: String,
    modelValue: {
        type: String,
        required: true,

    }
})
</script>
