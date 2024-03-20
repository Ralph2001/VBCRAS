<template>
    <div>
        <label :for="label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>
        <input type="text" :id="label" :value="modelValue" @input="emit('update:modelValue', $event.target.value)"
            class="bg-gray-50 uppercase border focus:bg-green-100 border-gray-300 font-bold text-gray-900 text-sm rounded-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            required />
    </div>
</template>

<script setup>

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
    label: String,
    modelValue: {
        required: true,
        type: [String, Number],
        default: ''
    }
})
</script>

<style lang="scss" scoped></style>