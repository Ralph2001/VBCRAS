<template>
    <div class="flex items-center" v-for="(value, key) in options" :key="key">
        <input :id="key" type="radio" :value="key" :name="name" @input="emit('update:modelValue', $event.target.value)"
            :checked="key === 'my'"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
        <label :for="key" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{ value }}</label>
    </div>
</template>

<script setup>


const emit = defineEmits(['update:modelValue'])

const props = defineProps({
    options: {
        type: [Object, Array],
        required: true
    },
    name: String,
    modelValue: {
        required: false,
        type: [String, Number],
        default: ''
    }
})

</script>
