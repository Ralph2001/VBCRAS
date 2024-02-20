<template>
    <div class="w-[15rem]">
        <label :for="label" :class="{ ' text-red-700': error }"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white focus:border-red-500">{{ label }}</label>
        <input type="text" :value="modelValue" :id="label" @input="emit('update:modelValue', $event.target.value)"
            :class="{ 'bg-red-50 border border-red-500 text-red-900 focus:border-red-500    ': error }"
            class="bg-gray-50 border focus:outline-none font-semibold  border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required />
        <slot>
        </slot>
    </div>
</template>

<script setup>

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    label: {
        type: String,
        required: true
    },
    modelValue: {
        type: String,
        default: null
    },
    error: {
        type: Boolean
    }
})
</script>

<style lang="scss" scoped></style>